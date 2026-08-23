"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  LayoutDashboard,
  BarChart3,
  LogOut,
  Receipt,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();


  const router = useRouter();

  const [details, setDetails] = useState({username:"",role:""});


  const menus = [
    {
      name: "Dashboard",

      href: "/dashboard",

      icon: LayoutDashboard,
    },

    {
      name: "Expense",
      href: "/expenses",
      icon: Receipt,
    },

    {
      name: "Analytics",

      href: "/reports",

      icon: BarChart3,
    },

    // {
    //   name: "Users",

    //   href: "/users",

    //   icon: User,
    // },
  ];

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const { data: userData } = await supabase.auth.getUser();

    const user = userData.user;


    if (!user) return;

    const { data, error } = await supabase

      .from("profiles")

      .select("full_name")

      .eq("id", user.id)

      .single();

    if (!error && data) {
      setDetails((prev)=>({...prev,username:data.full_name}));
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/");
  }

  return (
      <aside className="fixed left-0 top-0 h-screen w-64 button-bg text-white flex flex-col">

      <div className="p-4 border-b border-slate-700">
        <h1 className="flex items-center gap-3 text-2xl font-medium tracking-tight theme-text">
          <Image
            src="/logo.jpg"
            alt="Expense Manager Logo"
            width={44}
            height={44}
            className="rounded-xl object-contain"
          />
          <span className="text-lg tracking-wide">Expense Manager</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all

              ${pathname === menu.href
                  ? "theme-bg text-black sidebar-text"
                  : "text-slate-300 hover:theme-bg"
                }`}
            >
              <Icon size={20} className=""/>

              {menu.name}
            </Link>
          );
        })}
      </nav>


      <div className="border-t border-slate-600 p-4">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
          <div className="w-11 h-11 rounded-full theme-bg flex items-center justify-center text-white font-medium text-lg shadow-md">
            {details.username?.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col">
            <span className="text-white font-semimedium capitalize">
              {details.username}
            </span>
            <span className="text-xs theme-text flex items-center gap-1">
              <span className="w-2 h-2 rounded-full theme-bg"></span>
              Online
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="ml-auto p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
