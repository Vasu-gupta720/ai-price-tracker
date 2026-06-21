"use server";
import { createClient } from "@/utils/supabase/server";
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

    const { scrapeProduct } = await import("@/lib/firecrawl");
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
          curr_price : newPrice,
          currency : currency,
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

    const shouldAddHistory = !isUpdate || (existingProduct.curr_price !== newPrice);
    
    if(shouldAddHistory){
      await supabase.from("price_history").insert({
        product_id : data.id,
        price : newPrice,
        currency : currency,
        checked_at : new Date().toISOString(),
      });
    }

    revalidatePath("/");
    return {
      success : true,
      product: data,
      message:  isUpdate ? "Product updated successfully" : "Product added successfully"
    };
  } catch(error){
    console.error('Error in addProduct:', error);
    return {error : error.message || "Failed to scrape product data"};
  }
} 

export async function deleteProduct(productId){

  try{
    const supabase = await createClient();

    const {error} = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if(error){
      console.error("Error deleting product:", error);
      return {error : "Failed to delete product"};
    }

    revalidatePath("/");
    return {success : true, message : "Product deleted successfully"};
  } catch(error){
    return {error : error.message || "Failed to delete product"};
  }

}

export async function getProduct(){

  try{
    const supabase = await createClient();

    const {data, error} = await supabase
      .from("products")
      .select("*")
      .order("created_at" , {ascending : false});

    if(error) throw error;
    return data || [];
    } catch (error){
      console.error("Error fetching products:", error);
      return [];
    }
  }

  export async function getPriceHistory(productId){
    try{
      const supabase = await createClient();

      const {data, error} = await supabase
        .from("price_history")
        .select("*")
        .eq("product_id", productId)
        .order("checked_at" , {ascending : false});
      
      if(error) throw error;
      return data || [];

    } catch (error){
      console.error("Error fetching price history:", error);
      return [];
    }
  }
