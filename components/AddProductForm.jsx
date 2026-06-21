"use client";

import React, { useState } from 'react'
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { addProduct } from "@/app/auth/callback/action";
import { toast } from "sonner";
import { AuthModel } from "./AuthModel";

const AddProductForm = ({user}) => {
  const [url , setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal , setShowAuthModal] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    // Add product logic here
    const formData =  new FormData();
    formData.append("url", url);

    const result = await addProduct(formData);

    if(result.error){
      toast.error(result.error);
    }else{
      toast.success(result.message || "Product added successfully");
      setUrl("");
    }
    setLoading(false);
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className = "flex flex-col sm:flex-row gap-2">
        <Input type="url" placeholder="Product URL" 
        value = {url}
        onChange = {(e) => setUrl(e.target.value)}
        className="h-12 text-base"
        required
        disabled = {loading}
        />
         <Button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Track Price"
            )}
          </Button>
      </div>
    </form>

      {/* {Auth Modal} */}
      <AuthModel isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
  
}

export default AddProductForm;
