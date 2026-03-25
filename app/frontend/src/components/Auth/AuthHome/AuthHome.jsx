import React, { useState } from "react";
import Button from "../../UI/Buttons/Button";
import Card from "../../UI/Cards/Card";
import classes from "./AuthHome.module.css";

import { signIn, signUp, confirmSignUp, signOut } from "aws-amplify/auth";

const AuthHome = (props) => {
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
      setSuccessMessage(
        "Registration successful! Please check your email for the verification code.",
      );
    } catch (error) {
      setErrorMessage(error.message);
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
      setSuccessMessage("Email verified successfully! You can now log in.");
    } catch (error) {
      setErrorMessage(error.message);
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
        props.onLogin(formData.username);
      }
    } catch (error) {
      // Ha már eleve be van jelentkezve (bár a signOut után ez ritka), engedjük be!
      if (
        error.name === "UserAlreadyAuthenticatedException" ||
        error.message.includes("already a signed in user")
      ) {
        props.onLogin(formData.username);
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================
  // RENDERELÉSI NÉZETEK (Gyakorlatilag "al-komponensek")
  // ==========================================================

  if (view === "register") {
    return (
      <Card className={classes.auth}>
        <h1>Create Account</h1>
        <p>Join BLZ Transfer today.</p>
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}

        <form className={classes.form} onSubmit={handleRegister}>
          <div className={classes.inputGroup}>
            <label>Username</label>
            <input
              className={classes.input}
              name="username"
              required
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>Full Name</label>
            <input
              className={classes.input}
              type="text"
              name="name"
              required
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>Email Address</label>
            <input
              className={classes.input}
              type="email"
              name="email"
              required
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>Password</label>
            <input
              className={classes.input}
              type="password"
              name="password"
              required
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>Phone Number (e.g. +36301234567)</label>
            <input
              className={classes.input}
              type="tel"
              name="phone"
              required
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>Address</label>
            <input
              className={classes.input}
              type="text"
              name="address"
              required
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>Gender</label>
            <select
              className={classes.input}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            style={{ marginTop: "1rem" }}
          >
            {isLoading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <p className={classes.switchText}>
          Already have an account?
          <button
            type="button"
            className={classes.linkBtn}
            onClick={() => {
              setView("login");
              setErrorMessage("");
            }}
          >
            Log In
          </button>
        </p>
      </Card>
    );
  }

  if (view === "confirm") {
    return (
      <Card className={classes.auth}>
        <h1>Verify Email</h1>
        <p>We sent a 6-digit code to your email.</p>
        {successMessage && <p className={classes.success}>{successMessage}</p>}
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}

        <form className={classes.form} onSubmit={handleConfirmCode}>
          <div className={classes.inputGroup}>
            <label>Verification Code</label>
            <input
              className={classes.input}
              type="text"
              name="code"
              required
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            style={{ marginTop: "1rem" }}
          >
            {isLoading ? "Verifying..." : "Confirm Code"}
          </Button>
        </form>
      </Card>
    );
  }

  if (view === "login") {
    return (
      <Card className={classes.auth}>
        <h1>Welcome Back</h1>
        <p>Log in to access your secure files.</p>
        {successMessage && <p className={classes.success}>{successMessage}</p>}
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}

        <form className={classes.form} onSubmit={handleLogin}>
          <div className={classes.inputGroup}>
            <label>Username</label>
            <input
              className={classes.input}
              type="text"
              name="username"
              required
              onChange={handleChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label>Password</label>
            <input
              className={classes.input}
              type="password"
              name="password"
              required
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            style={{ marginTop: "1rem" }}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className={classes.switchText}>
          Don't have an account?
          <button
            type="button"
            className={classes.linkBtn}
            onClick={() => {
              setView("register");
              setErrorMessage("");
              setSuccessMessage("");
            }}
          >
            Sign Up
          </button>
        </p>
        <p className={classes.switchText} style={{ marginTop: "0.5rem" }}>
          <button
            type="button"
            className={classes.linkBtn}
            onClick={() => setView("home")}
          >
            Back to Home
          </button>
        </p>
      </Card>
    );
  }

  // --- ALAPÉRTELMEZETT (HOME) NÉZET ---
  return (
    <Card className={classes.auth}>
      <h1>Welcome to BLZ Transfer</h1>
      <p>Secure file sharing with integrated virus scanning.</p>

      <div className={classes.actions}>
        <Button className={classes.guestBtn} onClick={props.onContinueAsGuest}>
          Continue as Guest
        </Button>

        <Button className={classes.loginBtn} onClick={() => setView("login")}>
          Login to Account
        </Button>
      </div>
    </Card>
  );
};

export default AuthHome;
