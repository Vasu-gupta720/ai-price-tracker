"use server";
import { createClient } from "@/utils/supabase/server";
import { scrapeProduct } from "@/lib/firecrawl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}

export async function addProduct(formData){
  const url = formData.get("url");

  if(!url){
    return {error : "URL is required"};
  }

  try{
    const supabase = await createClient();
    const {
      data : {user},
    } = await supabase.auth.getUser();

    if(!user){
      return {error : "User not authenticated"};
    }

    const productData = await scrapeProduct(url);

    if(!productData.productName || !productData.currentPrice){
      return {error : "Failed to extract product information"};
    }

    const newPrice = parseFloat(productData.currentPrice);
    const currency = productData.currencyCode || "USD";

    const {data : existingProduct} = await supabase.from("products").select().eq("user_id", user.id).eq("url", url).single();

    const isUpdate = !!existingProduct;

    const {data, error} = await supabase
      .from("products")
      .upsert(
        {
          user_id: user.id,
          url,
          name : productData.productName,
          current_price : newPrice,
          currency_code : currency,
          image_url : productData.productImageUrl,
          updated_at : new Date().toISOString(),
        },
        {
          onConflict : "user_id,url",
          ignoreDuplicates : false,
        }
      )
      .select()
      .single();

    if(error){
      console.error("Error upserting product:", error);
      return {error : "Failed to add product"};
    }

    const shouldAddHistory = !isUpdate || (existingProduct.current_price !== newPrice);
    
    if(shouldAddHistory){
      await supabase.from("price_history").insert({
        product_id : data.id,
        price : newPrice,
        currency_code : currency,
        
      });
    }

    revalidatePath("/");
    return {success : true, product : data};
  } catch(error){
    console.error('Error scraping product:', error);
    return {error : "Failed to scrape product data"};
  }
} 
