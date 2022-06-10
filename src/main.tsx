import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider } from "@mantine/core";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

import { createClient } from "@supabase/supabase-js";
import { Provider } from "react-supabase";
import { AuthProvider } from "./app/contexts/auth-context";

/**
 * I know it's BAD PRACTICE to store keys like this
 * Didn't have much time to setup env variables
 * I hope you can understand me :)
 */
const supabaseUrl = "https://zstiiuqggduyjjirnpmz.supabase.co";
const supabaseKeyPublic =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdGlpdXFnZ2R1eWpqaXJucG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ4MDQxNjEsImV4cCI6MTk3MDM4MDE2MX0.QgAGsE646Q9S-p0Cill5qnp6OtR2y-yoBYAhdjIHOis";
const supabaseKeySecret =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdGlpdXFnZ2R1eWpqaXJucG16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY1NDgwNDE2MSwiZXhwIjoxOTcwMzgwMTYxfQ.AAP5dB8M6OlM9aB5JUKWpuFhpg417KekM48P2E_u7u0";
const supabase = createClient(supabaseUrl, supabaseKeySecret, {
  persistSession: true,
  multiTab: false,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <ModalsProvider>
        <NotificationsProvider>
          <Provider value={supabase}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </Provider>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
