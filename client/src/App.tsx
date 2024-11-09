import "@fontsource/roboto"; // Defaults to weight 400
import "@fontsource/roboto/400.css"; // Specify weight
import "@fontsource/roboto/400-italic.css"; // Specify weight and style

import Header from "./components/header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "@/pages/chat-page";
import Home from "@/pages/home";
import NotFoundPage from "@/pages/not-found";
import { SocketProvider } from "@/components/socket-provider";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="mt-[52px] mb-40 pt-5">
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="*" element={<NotFoundPage type="default" />} />
          </Routes>
        </SocketProvider>
      </div>
    </BrowserRouter>
  );
}
