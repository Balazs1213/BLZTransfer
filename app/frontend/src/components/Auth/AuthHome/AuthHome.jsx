import React, { useState } from "react";
import Button from "../../UI/Buttons/Button";
import Card from "../../UI/Cards/Card";
import classes from "./AuthHome.module.css";

import { signIn, signUp, confirmSignUp, signOut } from "aws-amplify/auth";

const AuthHome = (props) => {
  const { onLogin, onContinueAsGuest, language, t = (key) => key } = props;

  // Nézetek: 'home' | 'login' | 'register' | 'confirm'
  const [view, setView] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Űrlap adatok egyetlen objektumban
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    gender: "male",
    code: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 1. REGISZTRÁCIÓ LOGIKA ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await signUp({
        username: formData.username,
        password: formData.password,
        options: {
          userAttributes: {
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone, // Format: +36301234567
            address: formData.address,
            gender: formData.gender,
          },
        },
      });
      setView("confirm");
      setSuccessMessage(t("registrationSuccess"));
    } catch {
      setErrorMessage(t("authError"));
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. EMAIL MEGERŐSÍTÉS (OTP) LOGIKA ---
  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await confirmSignUp({
        username: formData.username,
        confirmationCode: formData.code,
      });
      setView("login");
      setSuccessMessage(t("emailVerified"));
    } catch {
      setErrorMessage(t("authError"));
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. BEJELENTKEZÉS LOGIKA ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // 1. ÚJDONSÁG: Biztos, ami biztos, kiléptetjük a "beragadt" felhasználót
      try {
        await signOut();
      } catch {
        /* Nem baj, ha nem volt senki belépve */
      }

      // 2. Jöhet a tényleges bejelentkezés
      const { isSignedIn } = await signIn({
        username: formData.username,
        password: formData.password,
      });

      if (isSignedIn) {
        onLogin(formData.username);
      }
    } catch (error) {
      // Ha már eleve be van jelentkezve (bár a signOut után ez ritka), engedjük be!
      if (
        error.name === "UserAlreadyAuthenticatedException" ||
        error.message.includes("already a signed in user")
      ) {
        onLogin(formData.username);
      } else {
        setErrorMessage(t("invalidCredentials"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetMessagesOnLanguageChange = () => {
    if (language) {
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  React.useEffect(() => {
    resetMessagesOnLanguageChange();
  }, [language]);

  // ==========================================================
  // RENDERELÉSI NÉZETEK (Gyakorlatilag "al-komponensek")
  // ==========================================================

  if (view === "register") {
    return (
      <Card className={classes.auth}>
        <h1>{t("registerTitle")}</h1>
        <p>{t("joinUs")}</p>
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}

        <form className={classes.form} onSubmit={handleRegister}>
          <div className={classes.inputGroup}>
            <label>{t("username")}</label>
            <input
              className={classes.input}
              name="username"
              required
              placeholder={t("username")}
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>{t("fullName")}</label>
            <input
              className={classes.input}
              type="text"
              name="name"
              required
              placeholder={t("fullName")}
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>{t("email")}</label>
            <input
              className={classes.input}
              type="email"
              name="email"
              required
              placeholder={t("email")}
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>{t("password")}</label>
            <input
              className={classes.input}
              type="password"
              name="password"
              required
              placeholder={t("password")}
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>{t("phone")}</label>
            <input
              className={classes.input}
              type="tel"
              name="phone"
              required
              placeholder={t("phonePlaceholder")}
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>{t("address")}</label>
            <input
              className={classes.input}
              type="text"
              name="address"
              required
              placeholder={t("address")}
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>{t("gender")}</label>
            <select
              className={classes.input}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">{t("male")}</option>
              <option value="female">{t("female")}</option>
              <option value="other">{t("other")}</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            style={{ marginTop: "1rem" }}
          >
            {isLoading ? t("creatingAccount") : t("registerAction")}
          </Button>
        </form>

        <p className={classes.switchText}>
          {t("alreadyHaveAccount")}
          <button
            type="button"
            className={classes.linkBtn}
            onClick={() => {
              setView("login");
              setErrorMessage("");
            }}
          >
            {t("login")}
          </button>
        </p>
      </Card>
    );
  }

  if (view === "confirm") {
    return (
      <Card className={classes.auth}>
        <h1>{t("verifyEmail")}</h1>
        <p>{t("emailVerificationSent")}</p>
        {successMessage && <p className={classes.success}>{successMessage}</p>}
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}

        <form className={classes.form} onSubmit={handleConfirmCode}>
          <div className={classes.inputGroup}>
            <label>{t("verificationCode")}</label>
            <input
              className={classes.input}
              type="text"
              name="code"
              required
              placeholder={t("verificationCode")}
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            style={{ marginTop: "1rem" }}
          >
            {isLoading ? t("verifyingCode") : t("confirmCode")}
          </Button>
        </form>
      </Card>
    );
  }

  if (view === "login") {
    return (
      <Card className={classes.auth}>
        <h1>{t("loginTitle")}</h1>
        <p>{t("loginPrompt")}</p>
        {successMessage && <p className={classes.success}>{successMessage}</p>}
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}

        <form className={classes.form} onSubmit={handleLogin}>
          <div className={classes.inputGroup}>
            <label>{t("username")}</label>
            <input
              className={classes.input}
              type="text"
              name="username"
              required
              placeholder={t("username")}
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>{t("password")}</label>
            <input
              className={classes.input}
              type="password"
              name="password"
              required
              placeholder={t("password")}
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            style={{ marginTop: "1rem" }}
          >
            {isLoading ? t("loggingIn") : t("loginAction")}
          </Button>
        </form>

        <p className={classes.switchText}>
          {t("noAccount")}
          <button
            type="button"
            className={classes.linkBtn}
            onClick={() => {
              setView("register");
              setErrorMessage("");
              setSuccessMessage("");
            }}
          >
            {t("register")}
          </button>
        </p>
        <p className={classes.switchText} style={{ marginTop: "0.5rem" }}>
          <button
            type="button"
            className={classes.linkBtn}
            onClick={() => setView("home")}
          >
            {t("backToHome")}
          </button>
        </p>
      </Card>
    );
  }

  // --- ALAPÉRTELMEZETT (HOME) NÉZET ---
  return (
    <Card className={classes.auth}>
      <h1>{t("welcomeBack")}</h1>
      <p>{t("secureFiles")}</p>

      <div className={classes.actions}>
        <Button className={classes.guestBtn} onClick={onContinueAsGuest}>
          {t("continueAsGuest")}
        </Button>

        <Button className={classes.loginBtn} onClick={() => setView("login")}>
          {t("loginToAccount")}
        </Button>
      </div>
    </Card>
  );
};

export default AuthHome;
