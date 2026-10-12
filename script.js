import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase-config.js";

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const authStatus = document.querySelector("#auth-status");
const authForm = document.querySelector("#auth-form");
const authSubmit = document.querySelector("#auth-submit");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const authName = document.querySelector("#auth-name");
const nameField = document.querySelector("#name-field");
const authForms = document.querySelector("#auth-forms");
const accountProfile = document.querySelector("#account-profile");
const passwordReset = document.querySelector("#password-reset");
const authSignout = document.querySelector("#auth-signout");
const authTabs = [...document.querySelectorAll(".auth-tab")];
let authView = "login";
let supabase = null;

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Menyuni ochish" : "Menyuni yopish");
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menyuni ochish");
    siteNav.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

function setAuthStatus(message, kind = "info") {
  authStatus.textContent = message;
  authStatus.dataset.kind = kind;
}

function setBusy(isBusy) {
  authSubmit.disabled = isBusy || !supabase;
  passwordReset.disabled = isBusy || !supabase;
  authSignout.disabled = isBusy || !supabase;
  authSubmit.setAttribute("aria-busy", String(isBusy));
}

function setAuthView(view) {
  authView = view;
  const isSignup = view === "signup";
  nameField.hidden = !isSignup;
  authName.required = isSignup;
  authPassword.autocomplete = isSignup ? "new-password" : "current-password";
  authSubmit.innerHTML = isSignup
    ? "Akkaunt yaratish <span aria-hidden=\"true\">↗</span>"
    : "Kirish <span aria-hidden=\"true\">↗</span>";
  passwordReset.hidden = isSignup;

  for (const tab of authTabs) {
    const isActive = tab.dataset.authView === view;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  }
}

function renderAccount(user) {
  const isSignedIn = Boolean(user);
  authForms.hidden = isSignedIn;
  accountProfile.hidden = !isSignedIn;

  if (!user) {
    return;
  }

  const displayName = user.user_metadata.display_name || user.email.split("@")[0];
  document.querySelector("#profile-name").textContent = displayName;
  document.querySelector("#profile-email").textContent = user.email;
  document.querySelector("#profile-avatar").textContent = displayName.charAt(0).toUpperCase();
  document.querySelector("#profile-created").textContent = new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(user.created_at));
}

function authErrorMessage(error) {
  return error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi.";
}

for (const tab of authTabs) {
  tab.addEventListener("click", () => setAuthView(tab.dataset.authView));
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabase) {
    setAuthStatus("Avval supabase-config.js faylida Supabase loyiha ma'lumotlarini sozlang.", "error");
    return;
  }

  setBusy(true);

  try {
    const email = authEmail.value.trim();
    const password = authPassword.value;
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const result = authView === "signup"
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: authName.value.trim() },
            emailRedirectTo: redirectTo,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setAuthStatus(`Kirish amalga oshmadi: ${result.error.message}`, "error");
      return;
    }

    if (authView === "signup" && !result.data.session) {
      setAuthStatus("Ro'yxatdan o'tish muvaffaqiyatli. Akkauntni tasdiqlash uchun emailingizni tekshiring.", "success");
      authForm.reset();
      return;
    }

    setAuthStatus(authView === "signup" ? "Akkaunt yaratildi va tizimga kirdingiz." : "Tizimga muvaffaqiyatli kirdingiz.", "success");
  } catch (error) {
    setAuthStatus(`Ulanishda xatolik: ${authErrorMessage(error)}`, "error");
  } finally {
    setBusy(false);
  }
});

passwordReset.addEventListener("click", async () => {
  if (!supabase) {
    setAuthStatus("Avval Supabase sozlamalarini kiriting.", "error");
    return;
  }

  if (!authEmail.validity.valid || !authEmail.value.trim()) {
    authEmail.reportValidity();
    setAuthStatus("Parolni tiklash uchun avval email manzilingizni kiriting.", "error");
    return;
  }

  setBusy(true);
  try {
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await supabase.auth.resetPasswordForEmail(authEmail.value.trim(), { redirectTo });
    if (error) {
      setAuthStatus(`Parolni tiklab bo'lmadi: ${error.message}`, "error");
      return;
    }
    setAuthStatus("Agar bu email Supabase akkauntiga tegishli bo'lsa, parolni tiklash xabari yuborildi.", "success");
  } catch (error) {
    setAuthStatus(`Ulanishda xatolik: ${authErrorMessage(error)}`, "error");
  } finally {
    setBusy(false);
  }
});

authSignout.addEventListener("click", async () => {
  if (!supabase) {
    setAuthStatus("Supabase bilan aloqa yo'q. Sahifani yangilab qayta urinib ko'ring.", "error");
    return;
  }

  setBusy(true);
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthStatus(`Akkauntdan chiqib bo'lmadi: ${error.message}`, "error");
      return;
    }
    setAuthStatus("Akkauntdan muvaffaqiyatli chiqdingiz.", "success");
  } catch (error) {
    setAuthStatus(`Ulanishda xatolik: ${authErrorMessage(error)}`, "error");
  } finally {
    setBusy(false);
  }
});

const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&
  Boolean(SUPABASE_ANON_KEY) &&
  !SUPABASE_ANON_KEY.includes("YOUR_");

if (isSupabaseConfigured) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  setBusy(false);
  supabase.auth.onAuthStateChange((_event, session) => {
    renderAccount(session?.user ?? null);
  });

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    setAuthStatus(`Akkaunt holatini tekshirib bo'lmadi: ${error.message}`, "error");
  } else {
    renderAccount(data.session?.user ?? null);
    setAuthStatus(
      data.session ? "Akkauntingizga muvaffaqiyatli ulandingiz." : "Kirish yoki yangi akkaunt yaratish uchun ma'lumotlaringizni kiriting.",
      "info",
    );
  }
} else {
  setAuthStatus("Akkauntni ulash uchun supabase-config.js faylida Supabase loyiha URL'i va public anon key'ini kiriting.", "error");
}
