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

const supabaseUrl = "https://zstiiuqggduyjjirnpmz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdGlpdXFnZ2R1eWpqaXJucG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ4MDQxNjEsImV4cCI6MTk3MDM4MDE2MX0.QgAGsE646Q9S-p0Cill5qnp6OtR2y-yoBYAhdjIHOis";
const supabase = createClient(supabaseUrl, supabaseKey);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <ModalsProvider>
        <NotificationsProvider>
          <Provider value={supabase}>
            <App />
          </Provider>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
