"use client";
import React from 'react'
import {useState} from 'react'
import { Button } from "@/components/ui/button";
import { AuthModel } from './AuthModel';
import { LogIn } from "lucide-react";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/auth/callback/action";


const AuthButton = ({ user }) => {
  const [showModal, setShowModal] = useState(false);

  if(user){
    return (
      <form action = {signOut}>
        <Button variant = "ghost" size = "sm" type = "submit" className = "gap-2">
          <LogOut className = "h-4 w-4" />
          Sign Out
        </Button>
      </form>
    )
  }
  
  return (
    <>
     <Button 
      onClick = {() => setShowModal(true)}
      variant="default" 
      size="default">
          <LogIn className="h-4 w-4" />
            Sign In

    </Button>

    <AuthModel isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
       
   
  )
}

export default AuthButton
