import { useEffect } from "react";
import axios from "axios";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

import { Chat } from "@/components/chat";

function App() {
  console.log("import.meta.env.BASE_URL", import.meta.env.VITE_BASE_URL);

  useEffect(() => {
    // Função para buscar os dados
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users`
        );
        console.log("response", response);
      } catch (err) {
        console.log("err", err);
      }
    };

    fetchData();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-screen bg-slate-100">
        <SidebarTrigger />
        <div className="flex items-center justify-center">
          <Chat />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default App;
