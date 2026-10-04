(() => {
    "use strict";

    const REQUIRED_PROJECT_REF = "iqqiizsehdjwenqowsqc";
    const CURRENT_PRIVACY_POLICY_VERSION = "2026-08-26";
    const WEB_APP_VERSION = "web-dev-2026.10.04-home-parity";
    const config = window.PROJECT_WEIGHT_DROP_WEB_CONFIG;
    const authView = document.getElementById("auth-view");
    const appView = document.getElementById("app-view");
    const appShell = document.getElementById("app-view");
    const loginForm = document.getElementById("login-form");
    const loginButton = document.getElementById("login-button");
    const authStatus = document.getElementById("auth-status");
    const configurationAlert = document.getElementById("configuration-alert");
    const authHeadingTitle = document.getElementById("auth-heading-title");
    const authHeadingCopy = document.getElementById("auth-heading-copy");
    const authModeButtons = [...document.querySelectorAll("[data-auth-mode]")];
    const signupOnlyElements = [...document.querySelectorAll("[data-signup-only]")];
    const privacyAction = document.getElementById("privacy-action");
    const displayNameInput = document.getElementById("display-name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const passwordConfirmInput = document.getElementById("password-confirm");
    const passwordToggle = document.getElementById("password-toggle");
    const routeTitle = document.getElementById("route-title");
    const dashboardOverview = document.getElementById("dashboard-overview");
    const profileDataPanel = document.getElementById("profile-data-panel");
    const foodSearchForm = document.getElementById("food-search-form");
    const foodSearchInput = document.getElementById("food-search-input");
    const fridgeForm = document.getElementById("fridge-form");
    const fridgeProducts = document.getElementById("fridge-products");
    const fridgeGenerateButton = document.getElementById("fridge-generate-button");
    const coachForm = document.getElementById("coach-form");
    const coachInput = document.getElementById("coach-input");
    const coachSendButton = document.getElementById("coach-send-button");
    const profileResetModal = document.getElementById("profile-reset-modal");
    const openProfileResetButton = document.getElementById("open-profile-reset");
    const cancelProfileResetButton = document.getElementById("cancel-profile-reset");
    const confirmProfileResetButton = document.getElementById("confirm-profile-reset");
    const profileResetConfirmation = document.getElementById("profile-reset-confirmation");
    const profileResetStatus = document.getElementById("profile-reset-status");
    const profileResetResult = document.getElementById("profile-reset-result");
    const healthConsentPanel = document.getElementById("health-consent-panel");
    const healthConsentCheckbox = document.getElementById("health-consent-checkbox");
    const healthConsentButton = document.getElementById("health-consent-button");
    const healthToolsContent = document.getElementById("health-tools-content");
    const waterForm = document.getElementById("water-form");
    const waterAmountInput = document.getElementById("water-amount");
    const stepsForm = document.getElementById("steps-form");
    const stepsAmountInput = document.getElementById("steps-amount");
    const measurementsForm = document.getElementById("measurements-form");
    const eventForm = document.getElementById("event-form");
    const eventDeleteButton = document.getElementById("event-delete-button");
    const eventCurrentWeightInput = document.getElementById("event-current-weight");
    const eventGoalWeightInput = document.getElementById("event-goal-weight");
    const eventProjection = document.getElementById("event-projection");
    const safetyForm = document.getElementById("safety-form");
    const preferencesForm = document.getElementById("preferences-form");
    const preferenceFoodList = document.getElementById("preference-food-list");
    const homeRefreshButton = document.getElementById("home-refresh-button");
    const weightEntryModal = document.getElementById("weight-entry-modal");
    const openWeightEntryButton = document.getElementById("open-weight-entry");
    const cancelWeightEntryButton = document.getElementById("cancel-weight-entry");
    const weightEntryForm = document.getElementById("weight-entry-form");
    const weightEntryValue = document.getElementById("weight-entry-value");
    const saveWeightEntryButton = document.getElementById("save-weight-entry");
    const profileSetupPanel = document.getElementById("profile-setup-panel");
    const profileSetupForm = document.getElementById("profile-setup-form");
    const profileSetupSubmit = document.getElementById("profile-setup-submit");
    const profileSetupConsent = document.getElementById("profile-setup-health-consent");
    const profileSetupGoalType = document.getElementById("setup-goal-type");
    const profileSetupAdjustmentField = document.getElementById("setup-adjustment-field");
    const profileSetupAdjustment = document.getElementById("setup-energy-adjustment");

    const routeLabels = Object.freeze({
        home: "Home",
        meals: "Posiłki",
        fridge: "Lodówka",
        coach: "AI Coach",
        progress: "Postępy",
        community: "Społeczność i wyzwania",
        profile: "Profil"
    });

    let client = null;
    let activeUserId = null;
    let dataLoadSequence = 0;
    let currentMealPlan = null;
    let selectedMealPlanDay = 0;
    let currentCoachConversationId = null;
    let authMode = "sign-in";
    let profileResetBusy = false;
    let profileResetPreviousFocus = null;
    let healthConsentGranted = false;
    let profileReadyForWrites = false;
    let currentMealPreferences = null;
    let currentPreferenceCatalog = [];
    let currentSafetyProfileComplete = false;
    let currentPremiumSnapshot = null;
    let premiumSnapshotUnavailable = false;
    let currentNutritionPlan = null;
    let mealPlanGenerating = false;
    let mealPlanSwappingId = null;
    let mealPlanLoggingId = null;
    let mealPlanShoppingOpen = false;
    let expandedMealPlanIds = new Set();
    let lockedMealPlanIds = new Set();
    let profileSetupBusy = false;
    let currentDashboardSnapshot = null;
    let weightEntryBusy = false;
    let weightEntryPreviousFocus = null;

    const numberFormatter = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });
    const weightFormatter = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    const macroFormatter = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

    function validConfiguration() {
        if (!config || config.environment !== "DEV" || config.projectRef !== REQUIRED_PROJECT_REF) return false;
        if (config.supabaseUrl !== `https://${REQUIRED_PROJECT_REF}.supabase.co`) return false;
        return typeof config.supabasePublishableKey === "string" &&
            config.supabasePublishableKey.startsWith("sb_publishable_");
    }

    function setAuthStatus(message, kind = "neutral") {
        authStatus.className = `auth-status ${kind}`;
        authStatus.innerHTML = "";
        const dot = document.createElement("span");
        dot.className = "status-dot";
        authStatus.append(dot, document.createTextNode(message));
    }

    function resetPasswordVisibility() {
        passwordInput.type = "password";
        passwordToggle.textContent = "Pokaż";
        passwordToggle.setAttribute("aria-label", "Pokaż hasło");
    }

    function setAuthMode(mode, { resetStatus = true } = {}) {
        authMode = mode === "sign-up" ? "sign-up" : "sign-in";
        const signingUp = authMode === "sign-up";
        authModeButtons.forEach((button) => {
            const active = button.dataset.authMode === authMode;
            button.classList.toggle("active", active);
            button.setAttribute("aria-selected", String(active));
            button.tabIndex = active ? 0 : -1;
        });
        signupOnlyElements.forEach((element) => { element.hidden = !signingUp; });
        displayNameInput.disabled = !signingUp;
        displayNameInput.required = signingUp;
        passwordConfirmInput.disabled = !signingUp;
        passwordConfirmInput.required = signingUp;
        emailInput.autocomplete = signingUp ? "email" : "username";
        passwordInput.autocomplete = signingUp ? "new-password" : "current-password";
        authHeadingTitle.textContent = signingUp ? "Utwórz konto" : "Witaj ponownie";
        authHeadingCopy.textContent = signingUp
            ? "Zarejestruj konto wspólne z aplikacją Android DEV."
            : "Zaloguj się kontem Project Weight Drop DEV.";
        privacyAction.textContent = signingUp ? "Tworząc konto" : "Logując się";
        loginButton.querySelector("span").textContent = signingUp ? "Utwórz konto" : "Zaloguj się";
        resetPasswordVisibility();
        if (resetStatus) {
            setAuthStatus(signingUp
                ? "Rejestracja wyłącznie w projekcie DEV"
                : "Połączenie wyłącznie z projektem DEV");
        }
    }

    function setAuthBusy(busy) {
        loginButton.disabled = busy;
        authModeButtons.forEach((button) => { button.disabled = busy; });
        displayNameInput.disabled = busy || authMode !== "sign-up";
        emailInput.disabled = busy;
        passwordInput.disabled = busy;
        passwordConfirmInput.disabled = busy || authMode !== "sign-up";
        loginButton.classList.toggle("loading", busy);
        loginButton.querySelector("span").textContent = busy
            ? (authMode === "sign-up" ? "Tworzenie konta…" : "Logowanie…")
            : (authMode === "sign-up" ? "Utwórz konto" : "Zaloguj się");
    }

    function friendlyAuthError(error, mode = authMode) {
        const message = String(error?.message || "").toLowerCase();
        if (message.includes("email not confirmed")) return "Najpierw potwierdź adres e-mail.";
        if (message.includes("invalid login credentials")) return "Nieprawidłowy e-mail lub hasło.";
        if (message.includes("user already registered")) return "Konto z tym adresem już istnieje. Przejdź do logowania.";
        if (message.includes("invalid email") || message.includes("email address is invalid")) return "Podaj poprawny adres e-mail.";
        if (message.includes("password") && (message.includes("weak") || message.includes("at least"))) return "Hasło musi mieć co najmniej 8 znaków.";
        if (message.includes("rate limit") || message.includes("too many")) return "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.";
        if (message.includes("failed to fetch") || message.includes("network")) return "Brak połączenia z usługą logowania DEV.";
        return mode === "sign-up"
            ? "Nie udało się utworzyć konta. Spróbuj ponownie."
            : "Nie udało się zalogować. Spróbuj ponownie.";
    }

    function normalizeDisplayName(value) {
        return value.trim().replace(/\s+/g, " ");
    }

    function validDisplayName(value) {
        const normalized = normalizeDisplayName(value);
        return normalized.length >= 2 &&
            normalized.length <= 30 &&
            !/[\u0000-\u001f\u007f]/.test(normalized) &&
            /[\p{L}\p{N}]/u.test(normalized);
    }

    function userDisplayName(user) {
        const metadataName = typeof user?.user_metadata?.display_name === "string"
            ? user.user_metadata.display_name.trim()
            : "";
        if (metadataName) return metadataName;
        const emailPrefix = user?.email?.split("@")[0]?.trim();
        return emailPrefix || "Użytkowniku";
    }

    function avatarLetter(name) {
        const letter = name.trim().charAt(0).toLocaleUpperCase("pl-PL");
        return letter || "U";
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function finiteNumber(value) {
        if (value === null || value === undefined || value === "") return null;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    function formatNumber(value) {
        const parsed = finiteNumber(value);
        return parsed === null ? "—" : numberFormatter.format(Math.round(parsed));
    }

    function formatWeight(value) {
        const parsed = finiteNumber(value);
        return parsed === null ? "—" : weightFormatter.format(parsed);
    }

    function formatMacro(value) {
        const parsed = finiteNumber(value);
        return parsed === null ? "—" : macroFormatter.format(parsed);
    }

    function formatDate(value, includesTime = false) {
        if (!value) return "—";
        let date;
        if (!includesTime && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
            const [year, month, day] = String(value).split("-").map(Number);
            date = new Date(year, month - 1, day);
        } else {
            date = new Date(value);
        }
        if (Number.isNaN(date.getTime())) return "—";
        return new Intl.DateTimeFormat("pl-PL", includesTime
            ? { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }
            : { day: "2-digit", month: "short" }).format(date);
    }

    function setProgress(id, value, max) {
        const element = document.getElementById(id);
        if (!element) return;
        const safeValue = finiteNumber(value) ?? 0;
        const safeMax = finiteNumber(max) ?? 0;
        const percent = safeMax > 0 ? Math.max(0, Math.min(100, (safeValue / safeMax) * 100)) : 0;
        element.style.width = `${percent}%`;
        element.parentElement?.setAttribute("role", "progressbar");
        element.parentElement?.setAttribute("aria-valuemin", "0");
        element.parentElement?.setAttribute("aria-valuemax", "100");
        element.parentElement?.setAttribute("aria-valuenow", String(Math.round(percent)));
    }

    function setStatusCard(cardId, state) {
        const card = document.getElementById(cardId);
        if (!card) return;
        card.classList.toggle("ready", state === "ready");
        card.classList.toggle("error", state === "error");
    }

    function resetAccountViews() {
        currentMealPlan = null;
        selectedMealPlanDay = 0;
        currentCoachConversationId = null;
        healthConsentGranted = false;
        profileReadyForWrites = false;
        currentMealPreferences = null;
        currentPreferenceCatalog = [];
        currentSafetyProfileComplete = false;
        currentPremiumSnapshot = null;
        premiumSnapshotUnavailable = false;
        currentNutritionPlan = null;
        mealPlanGenerating = false;
        mealPlanSwappingId = null;
        mealPlanLoggingId = null;
        mealPlanShoppingOpen = false;
        expandedMealPlanIds = new Set();
        lockedMealPlanIds = new Set();
        profileSetupBusy = false;
        currentDashboardSnapshot = null;
        weightEntryBusy = false;
        if (weightEntryModal) weightEntryModal.hidden = true;
        dashboardOverview?.setAttribute("aria-busy", "true");
        profileDataPanel?.setAttribute("aria-busy", "true");
        setText("dashboard-message", "Pobieranie danych DEV…");
        setText("profile-data-message", "Pobieranie własnego profilu DEV…");
        setText("home-profile-status", "Ładowanie…");
        setText("home-profile-detail", "Sprawdzanie własnego rekordu DEV");
        setText("home-data-status", "Ładowanie…");
        setText("home-data-detail", "Bez danych przykładowych i bez PROD");
        setStatusCard("profile-status-card", "loading");
        setStatusCard("dashboard-status-card", "loading");
        [
            "home-calories-remaining", "home-calories-detail", "home-current-weight", "home-goal-weight",
            "home-water", "home-steps", "home-protein", "home-fat", "home-carbs",
            "home-calories-target", "home-calories-consumed", "home-calories-total",
            "home-protein-percent", "home-fat-percent", "home-carbs-percent",
            "home-weight-progress", "home-weight-detail", "home-next-milestone",
            "home-start-weight", "home-average-weight", "home-weight-change", "profile-onboarding", "profile-diet",
            "profile-goal", "profile-meals", "profile-start-weight", "profile-current-weight",
            "profile-goal-weight", "profile-activity", "profile-strength", "profile-average-steps",
            "profile-timezone", "profile-plan-status", "progress-data-days", "progress-meals",
            "progress-calories", "progress-steps", "progress-water", "progress-weight-change",
            "weight-history-count", "steps-history-count"
        ].forEach((id) => setText(id, "—"));
        [
            "home-calories-bar", "home-protein-bar", "home-fat-bar", "home-carbs-bar",
            "home-weight-progress-bar"
        ].forEach((id) => setProgress(id, 0, 100));
        document.getElementById("progress-summary")?.setAttribute("aria-busy", "true");
        setText("progress-message", "Pobieranie raportu DEV…");
        const weightHistory = document.getElementById("weight-history-list");
        const stepsHistory = document.getElementById("steps-history-list");
        const todayMeals = document.getElementById("today-meals-list");
        const mealPlanList = document.getElementById("meal-plan-list");
        if (weightHistory) weightHistory.innerHTML = '<p class="empty-history">Pobieranie…</p>';
        if (stepsHistory) stepsHistory.innerHTML = '<p class="empty-history">Pobieranie…</p>';
        if (todayMeals) todayMeals.innerHTML = '<p class="empty-history">Pobieranie…</p>';
        if (mealPlanList) mealPlanList.innerHTML = '<p class="empty-history">Pobieranie…</p>';
        document.getElementById("meal-day-tabs")?.replaceChildren();
        document.getElementById("food-search-results")?.replaceChildren();
        if (foodSearchInput) foodSearchInput.value = "";
        setText("meals-message", "Pobieranie dziennika DEV…");
        setText("meals-calories-total", "—");
        setText("today-meals-count", "—");
        setText("meal-plan-message", "Pobieranie aktywnego planu DEV…");
        setText("meal-plan-access-title", "Sprawdzanie dostępu…");
        setText("meal-plan-access-copy", "Plan korzysta z aktywnej diety, kalorii, makro i zabezpieczeń konta DEV.");
        setText("meal-plan-quota", "—");
        setToolStatus("meal-plan-action-status", "");
        setText("food-search-status", "Wpisz co najmniej 2 znaki.");
        if (fridgeProducts) fridgeProducts.value = "";
        document.getElementById("fridge-result")?.setAttribute("hidden", "");
        setText("fridge-status", "Gotowe do wygenerowania.");
        document.getElementById("fridge-status")?.classList.remove("error");
        if (coachInput) coachInput.value = "";
        const coachMessages = document.getElementById("coach-messages");
        if (coachMessages) coachMessages.innerHTML = '<p class="empty-history">Pobieranie…</p>';
        setText("coach-status", "Pobieranie historii DEV…");
        setText("coach-limit", "Limit sprawdzany przy wysłaniu");
        ["community-points", "community-rank", "challenges-count", "leaderboard-count", "posts-count"]
            .forEach((id) => setText(id, "—"));
        setText("community-message", "Pobieranie danych DEV…");
        const challengeList = document.getElementById("challenge-list");
        const leaderboardList = document.getElementById("leaderboard-list");
        const communityPosts = document.getElementById("community-posts");
        if (challengeList) challengeList.innerHTML = '<p class="empty-history">Pobieranie…</p>';
        if (leaderboardList) leaderboardList.innerHTML = '<p class="empty-history">Pobieranie…</p>';
        if (communityPosts) communityPosts.innerHTML = '<p class="empty-history">Pobieranie…</p>';
        waterForm?.reset();
        stepsForm?.reset();
        measurementsForm?.reset();
        eventForm?.reset();
        safetyForm?.reset();
        preferencesForm?.reset();
        profileSetupForm?.reset();
        if (profileSetupForm) delete profileSetupForm.dataset.prefilledFor;
        if (profileSetupPanel) profileSetupPanel.hidden = true;
        setToolStatus("profile-setup-status", "");
        if (eventDeleteButton) eventDeleteButton.hidden = true;
        if (eventProjection) eventProjection.hidden = true;
        if (preferenceFoodList) preferenceFoodList.innerHTML = '<p class="empty-history">Pobieranie katalogu DEV…</p>';
        if (healthConsentCheckbox) healthConsentCheckbox.checked = false;
        if (healthConsentButton) healthConsentButton.disabled = true;
        if (healthConsentPanel) healthConsentPanel.hidden = true;
        setHomeTool(null);
        setText("water-tool-summary", "Dzisiejszy zapis");
        setText("steps-tool-summary", "Dzisiejszy wynik");
        setText("measurements-tool-summary", "Ostatni pomiar");
        setText("event-tool-summary", "Ustaw cel z datą");
        setText("safety-profile-state", "Pobieranie…");
        setText("preferences-state", "Pobieranie…");
        ["health-consent-status", "water-form-status", "steps-form-status", "measurements-form-status", "event-form-status", "safety-form-status", "preferences-form-status"]
            .forEach((id) => setToolStatus(id, ""));
        updateHealthToolsAvailability();
    }

    function friendlyDataError(error) {
        const message = String(error?.message || error?.details || "").toLowerCase();
        if (message.includes("profile_not_found")) return "Najpierw dokończ konfigurację profilu DEV.";
        if (message.includes("authentication_required") || message.includes("jwt")) return "Sesja wygasła. Zaloguj się ponownie.";
        if (message.includes("failed to fetch") || message.includes("network")) return "Nie udało się połączyć z danymi DEV.";
        return "Nie udało się pobrać danych DEV. Spróbuj ponownie później.";
    }

    async function edgeFunctionErrorCode(error, data) {
        if (typeof data?.error === "string") return data.error;
        const response = error?.context;
        if (response && typeof response.clone === "function") {
            try {
                const payload = await response.clone().json();
                if (typeof payload?.error === "string") return payload.error;
            } catch {
                // Odpowiedź bez JSON — pokaż bezpieczny komunikat ogólny.
            }
        }
        return "unknown_error";
    }

    function setProfileResetStatus(message = "", kind = "error") {
        if (!profileResetStatus) return;
        profileResetStatus.textContent = message;
        profileResetStatus.classList.toggle("success", kind === "success");
    }

    function setProfileResetBusy(busy) {
        profileResetBusy = busy;
        if (profileResetConfirmation) profileResetConfirmation.disabled = busy;
        if (cancelProfileResetButton) cancelProfileResetButton.disabled = busy;
        if (confirmProfileResetButton) {
            confirmProfileResetButton.disabled = busy || profileResetConfirmation?.value !== "RESET";
            confirmProfileResetButton.textContent = busy ? "Resetowanie…" : "Zacznij od nowa";
        }
    }

    function openProfileReset() {
        if (!profileResetModal || !activeUserId) return;
        profileResetPreviousFocus = document.activeElement;
        profileResetConfirmation.value = "";
        setProfileResetStatus();
        setProfileResetBusy(false);
        profileResetModal.hidden = false;
        document.body.classList.add("modal-open");
        window.setTimeout(() => profileResetConfirmation?.focus(), 0);
    }

    function closeProfileReset() {
        if (!profileResetModal || profileResetBusy) return;
        profileResetModal.hidden = true;
        document.body.classList.remove("modal-open");
        profileResetConfirmation.value = "";
        setProfileResetStatus();
        if (profileResetPreviousFocus instanceof HTMLElement) profileResetPreviousFocus.focus();
        profileResetPreviousFocus = null;
    }

    function setWeightEntryBusy(busy) {
        weightEntryBusy = busy;
        if (weightEntryValue) weightEntryValue.disabled = busy;
        if (cancelWeightEntryButton) cancelWeightEntryButton.disabled = busy;
        if (saveWeightEntryButton) {
            saveWeightEntryButton.disabled = busy;
            saveWeightEntryButton.textContent = busy ? "Zapisywanie…" : "Zapisz";
        }
    }

    function openWeightEntry() {
        if (!weightEntryModal) return;
        weightEntryPreviousFocus = document.activeElement;
        const currentWeight = finiteNumber(currentDashboardSnapshot?.current_weight_kg);
        if (weightEntryValue) weightEntryValue.value = currentWeight === null ? "" : String(currentWeight);
        setToolStatus("weight-entry-status", "");
        setWeightEntryBusy(false);
        weightEntryModal.hidden = false;
        document.body.classList.add("modal-open");
        window.setTimeout(() => {
            weightEntryValue?.focus();
            weightEntryValue?.select();
        }, 0);
    }

    function closeWeightEntry() {
        if (!weightEntryModal || weightEntryBusy) return;
        weightEntryModal.hidden = true;
        document.body.classList.remove("modal-open");
        setToolStatus("weight-entry-status", "");
        if (weightEntryPreviousFocus instanceof HTMLElement) weightEntryPreviousFocus.focus();
        weightEntryPreviousFocus = null;
    }

    async function saveWeightEntry() {
        if (!requireHealthWrite("weight-entry-status")) return;
        const value = decimalInputValue(weightEntryValue);
        if (value === null || value < 35 || value > 350) {
            setToolStatus("weight-entry-status", "Wpisz wagę od 35 do 350 kg.", "error");
            weightEntryValue?.focus();
            return;
        }

        setWeightEntryBusy(true);
        setToolStatus("weight-entry-status", "Zapisywanie w DEV…");
        const { error } = await client.rpc("log_weight", {
            p_weight_kg: value,
            p_measured_at: new Date().toISOString()
        });
        if (error) {
            setWeightEntryBusy(false);
            setToolStatus("weight-entry-status", healthWriteError(error, "Nie udało się zapisać wagi w DEV."), "error");
            return;
        }

        setWeightEntryBusy(false);
        closeWeightEntry();
        const { data, error: userError } = await client.auth.getUser();
        if (!userError && data.user) await loadAccountData(data.user);
    }

    function profileResetErrorMessage(code) {
        const messages = {
            authentication_required: "Sesja wygasła. Zaloguj się ponownie.",
            reset_confirmation_required: "Wpisz dokładnie RESET, aby potwierdzić.",
            self_profile_reset_failed: "Nie udało się zresetować danych. Spróbuj ponownie później."
        };
        return messages[code] || "Nie udało się zresetować danych DEV. Spróbuj ponownie.";
    }

    async function resetOwnProfile() {
        if (!client || !activeUserId) {
            setProfileResetStatus("Sesja wygasła. Zaloguj się ponownie.");
            return;
        }
        if (profileResetConfirmation?.value !== "RESET") {
            setProfileResetStatus("Wpisz dokładnie RESET, aby potwierdzić.");
            profileResetConfirmation?.focus();
            return;
        }

        setProfileResetBusy(true);
        setProfileResetStatus("Trwa bezpieczne resetowanie danych DEV…", "success");
        const { data, error } = await client.functions.invoke("reset-my-profile", {
            body: { confirmation: "RESET", understands_data_loss: true }
        });

        if (error || data?.reset !== true) {
            const code = await edgeFunctionErrorCode(error, data);
            setProfileResetBusy(false);
            setProfileResetStatus(profileResetErrorMessage(code));
            return;
        }

        setProfileResetBusy(false);
        closeProfileReset();
        if (profileResetResult) {
            profileResetResult.classList.remove("error");
            profileResetResult.textContent = "Profil i postępy zostały zresetowane. Formularz konfiguracji startowej jest gotowy w Profilu.";
        }
        const { data: userData, error: userError } = await client.auth.getUser();
        if (!userError && userData.user) {
            activeUserId = null;
            showSignedIn(userData.user);
            navigateTo("profile");
        }
    }

    function featureErrorMessage(code, feature) {
        const normalizedCode = String(code || "unknown_error").toLowerCase();
        const messages = {
            authentication_required: "Sesja wygasła. Zaloguj się ponownie.",
            invalid_fridge_products: "Podaj produkty i ilości (od 3 do 2000 znaków).",
            invalid_fridge_target: "Cel posiłku ma nieprawidłowe wartości.",
            fridge_daily_target_complete: "Dzisiejszy cel został już zrealizowany.",
            fridge_premium_required: "Ta funkcja Lodówki wymaga aktywnego dostępu PRO.",
            pro_required: "Ta funkcja wymaga aktywnego dostępu PRO.",
            daily_quota_exhausted: "Dzisiejszy limit generowania został wykorzystany.",
            fridge_service_unavailable: "Lodówka DEV jest chwilowo niedostępna.",
            generation_quota_unavailable: "Nie udało się sprawdzić limitu generowania.",
            coach_daily_quota_exhausted: "Dzisiejszy limit AI Coacha został wykorzystany.",
            coach_free_quota_exhausted: "Wykorzystano dostępny limit AI Coacha.",
            premium_state_unavailable: "Nie udało się sprawdzić dostępu PRO.",
            coach_context_unavailable: "Dane potrzebne Coachowi są chwilowo niedostępne.",
            coach_meal_context_unavailable: "Dziennik posiłków jest chwilowo niedostępny dla Coacha.",
            ai_service_error: "Usługa AI DEV nie odpowiedziała poprawnie. Spróbuj ponownie.",
            invalid_message: "Wiadomość jest pusta albo zbyt długa.",
            premium_required: "Generowanie planu posiłków wymaga aktywnego dostępu PRO.",
            meal_preferences_required: "Najpierw zapisz alergie i preferencje na Home — również wtedy, gdy nie masz alergii.",
            meal_preferences_unavailable: "Nie udało się pobrać alergii i preferencji DEV.",
            profile_not_found: "Najpierw dokończ profil Project Weight Drop DEV.",
            active_plan_not_found: "Brak aktywnego planu kalorii i makro. Najpierw dokończ konfigurację planu.",
            meal_plan_unavailable: "Nie udało się pobrać aktualnego planu posiłków.",
            invalid_day_index: "Wybrano nieprawidłowy dzień planu.",
            keto_target_not_validated: "Cel KETO wymaga ponownej walidacji w aplikacji DEV.",
            low_carb_target_not_validated: "Cel LOW CARB wymaga ponownej walidacji w aplikacji DEV.",
            balanced_target_not_validated: "Cel BALANCE wymaga ponownej walidacji w aplikacji DEV.",
            meal_day_regeneration_quota_exhausted: "Dzisiejszy limit ponownego generowania dni został wykorzystany.",
            pro_day_regeneration_daily_limit_reached: "Dzisiejszy limit ponownego generowania dni został wykorzystany.",
            meal_swap_quota_exhausted: "Dzisiejszy limit zamian posiłków został wykorzystany.",
            pro_meal_swap_daily_limit_reached: "Dzisiejszy limit zamian posiłków został wykorzystany.",
            trial_meal_swap_limit_reached: "Limit zamian posiłków w okresie próbnym został wykorzystany.",
            invalid_meal_id: "Nie udało się rozpoznać wybranego posiłku.",
            meal_not_found: "Wybrany posiłek nie należy już do aktywnego planu.",
            meal_plan_not_found: "Nie znaleziono aktywnego planu posiłków.",
            meal_plan_day_unavailable: "Nie udało się pobrać wybranego dnia planu.",
            meal_items_unavailable: "Nie udało się pobrać składników wybranego posiłku.",
            meal_swap_target_unavailable: "Nie udało się bezpiecznie dopasować zamiany do celu dnia.",
            meal_swap_unavailable: "Nie udało się przygotować poprawnej zamiany. Spróbuj ponownie.",
            meal_swap_store_failed: "Nowy posiłek nie został zapisany. Spróbuj ponownie.",
            meal_plan_readback_failed: "Zmiana została wysłana, ale nie udało się odświeżyć planu.",
            no_valid_day: "Generator nie przygotował poprawnego dnia. Spróbuj ponownie.",
            build_failed: "Generator nie zbudował poprawnego dnia. Spróbuj ponownie.",
            day_validation_failed: "Wygenerowany dzień nie przeszedł kontroli kalorii, makro lub składników. Spróbuj ponownie.",
            keto_day_validation_failed: "Wygenerowany dzień KETO nie przeszedł kontroli kalorii, makro lub składników. Spróbuj ponownie.",
            food_store_failed: "Nie udało się zapisać produktów wygenerowanego dnia.",
            day_store_failed: "Nie udało się zapisać wygenerowanego dnia.",
            meal_planner_not_configured: "Generator planów DEV jest chwilowo niedostępny."
        };
        return messages[normalizedCode] || `Nie udało się uruchomić funkcji ${feature} w DEV.`;
    }

    function setToolStatus(id, message, kind = "neutral") {
        const element = document.getElementById(id);
        if (!element) return;
        element.textContent = message;
        element.classList.toggle("success", kind === "success");
        element.classList.toggle("error", kind === "error");
    }

    function renderHomeDate() {
        const target = document.getElementById("home-today-date");
        if (!target) return;
        target.dateTime = localToday();
        target.textContent = new Intl.DateTimeFormat("pl-PL", {
            weekday: "short", day: "numeric", month: "short"
        }).format(new Date()).replace(/\.$/, "");
    }

    function setHomeTool(tool) {
        const selectedTool = String(tool || "");
        document.querySelectorAll("[data-home-tool]").forEach((button) => {
            const selected = button.dataset.homeTool === selectedTool;
            button.setAttribute("aria-selected", String(selected));
            button.tabIndex = 0;
        });
        document.querySelectorAll("[data-home-tool-panel]").forEach((panel) => {
            panel.hidden = panel.dataset.homeToolPanel !== selectedTool;
        });
    }

    function openHomeTool(tool) {
        const normalized = String(tool || "");
        const button = document.querySelector(`[data-home-tool="${normalized}"]`);
        if (!button) return;
        const alreadySelected = button.getAttribute("aria-selected") === "true";
        setHomeTool(alreadySelected ? null : normalized);
        if (!alreadySelected) {
            document.getElementById(`home-${normalized}-panel`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    function healthForms() {
        return [waterForm, stepsForm, measurementsForm, eventForm, safetyForm, preferencesForm].filter(Boolean);
    }

    function updateHealthToolsAvailability() {
        const available = healthConsentGranted && profileReadyForWrites;
        healthToolsContent?.classList.toggle("is-disabled", !available);
        document.querySelector(".safety-grid")?.classList.toggle("is-disabled", !available);
        healthForms().forEach((form) => {
            const busy = form.dataset.busy === "true";
            form.querySelectorAll("input, select, button").forEach((control) => {
                control.disabled = !available || busy;
            });
        });
    }

    function setToolFormBusy(form, busy) {
        if (!form) return;
        form.dataset.busy = String(busy);
        updateHealthToolsAvailability();
    }

    function requireHealthWrite(statusId) {
        if (!client || !activeUserId) {
            setToolStatus(statusId, "Sesja wygasła. Zaloguj się ponownie.", "error");
            return false;
        }
        if (!healthConsentGranted) {
            setToolStatus(statusId, "Najpierw zapisz zgodę na przetwarzanie danych zdrowotnych.", "error");
            healthConsentPanel?.scrollIntoView({ behavior: "smooth", block: "center" });
            return false;
        }
        if (!profileReadyForWrites) {
            setToolStatus(statusId, "Najpierw dokończ konfigurację profilu i planu w zakładce Profil.", "error");
            return false;
        }
        return true;
    }

    function healthWriteError(error, fallback) {
        const message = String(error?.message || error?.details || error?.hint || "").toLowerCase();
        if (message.includes("authentication_required") || message.includes("jwt")) return "Sesja wygasła. Zaloguj się ponownie.";
        if (message.includes("profile_not_found")) return "Najpierw dokończ profil w aplikacji Android DEV.";
        if (message.includes("invalid_water_amount")) return "Wpisz od 50 do 2000 ml.";
        if (message.includes("invalid_steps")) return "Wpisz liczbę kroków od 0 do 200 000.";
        if (message.includes("body_measurement_required")) return "Wpisz przynajmniej jeden obwód.";
        if (message.includes("invalid_body_measurement")) return "Każdy obwód musi mieścić się w zakresie 10–300 cm.";
        if (message.includes("invalid_event_name")) return "Nazwa wydarzenia musi mieć od 1 do 80 znaków.";
        if (message.includes("event_date_in_past")) return "Data wydarzenia nie może być wcześniejsza niż dzisiaj.";
        if (message.includes("invalid_allergen_key") || message.includes("invalid_food_preference")) return "Jedna z wybranych preferencji jest nieprawidłowa.";
        if (message.includes("invalid_max_cook_minutes")) return "Wybierz prawidłowy czas przygotowania.";
        if (message.includes("health_data_consent")) return "Najpierw zapisz zgodę na przetwarzanie danych zdrowotnych.";
        if (message.includes("failed to fetch") || message.includes("network")) return "Brak połączenia z bazą DEV.";
        return fallback;
    }

    function localToday() {
        const now = new Date();
        return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }

    function localDateOffset(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }

    function decimalInputValue(input) {
        const raw = input?.value.trim().replace(",", ".") || "";
        if (!raw) return null;
        const value = Number(raw);
        return Number.isFinite(value) ? value : null;
    }

    function eventProjectionResult(eventDate, currentWeightKg, goalWeightKg) {
        const eventTime = Date.parse(`${eventDate}T00:00:00Z`);
        const todayTime = Date.parse(`${localToday()}T00:00:00Z`);
        const days = Math.round((eventTime - todayTime) / 86400000);
        if (!Number.isFinite(currentWeightKg) || !Number.isFinite(goalWeightKg) ||
            !Number.isInteger(days) || days <= 0 || currentWeightKg < 30 || currentWeightKg > 350 ||
            goalWeightKg < 30 || goalWeightKg > 350 || currentWeightKg <= goalWeightKg) return null;
        const weeks = days / 7;
        const targetLossKg = currentWeightKg - goalWeightKg;
        const minimumLossKg = Math.min(targetLossKg, weeks * 0.5);
        const maximumLossKg = Math.min(targetLossKg, weeks * 1);
        return {
            days,
            minimumLossKg,
            maximumLossKg,
            requiredWeeklyLossKg: targetLossKg / weeks,
            targetLossKg,
            minimumEstimatedWeightKg: currentWeightKg - maximumLossKg,
            maximumEstimatedWeightKg: currentWeightKg - minimumLossKg
        };
    }

    function renderEventProjection() {
        if (!eventProjection) return null;
        const date = document.getElementById("event-date")?.value || "";
        const projection = eventProjectionResult(
            date,
            decimalInputValue(eventCurrentWeightInput),
            decimalInputValue(eventGoalWeightInput)
        );
        eventProjection.hidden = !projection;
        if (!projection) return null;
        const oneDecimal = (value) => value.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        setText("event-days", String(projection.days));
        setText("event-loss-range", `${oneDecimal(projection.minimumLossKg)}–${oneDecimal(projection.maximumLossKg)} kg`);
        setText("event-weight-range", `${oneDecimal(projection.minimumEstimatedWeightKg)}–${oneDecimal(projection.maximumEstimatedWeightKg)} kg`);
        setText("event-target-loss", `${oneDecimal(projection.targetLossKg)} kg`);
        setText("event-required-pace", `${projection.requiredWeeklyLossKg.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg/tydzień`);
        const warning = document.getElementById("event-pace-warning");
        if (warning) warning.hidden = projection.requiredWeeklyLossKg <= 1;
        return projection;
    }

    function renderHealthConsent(consent, error = null) {
        healthConsentGranted = Boolean(consent?.explicit_health_data_consent);
        if (healthConsentPanel) healthConsentPanel.hidden = healthConsentGranted;
        if (profileSetupConsent) {
            profileSetupConsent.checked = healthConsentGranted || profileSetupConsent.checked;
            profileSetupConsent.disabled = healthConsentGranted || profileSetupBusy;
        }
        if (error) {
            setToolStatus("health-consent-status", "Nie udało się sprawdzić zgody DEV. Odśwież stronę.", "error");
        } else {
            setToolStatus("health-consent-status", "");
        }
        updateHealthToolsAvailability();
    }

    function renderBodyMeasurement(entry, error = null) {
        if (error) {
            setText("measurements-tool-summary", "Odczyt niedostępny");
            return;
        }
        const fields = [
            ["measurement-waist", entry?.waist_cm], ["measurement-hips", entry?.hips_cm],
            ["measurement-chest", entry?.chest_cm], ["measurement-arm", entry?.arm_cm],
            ["measurement-thigh", entry?.thigh_cm]
        ];
        fields.forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) input.value = finiteNumber(value) === null ? "" : String(value);
        });
        const values = fields.filter(([, value]) => finiteNumber(value) !== null).length;
        setText("measurements-tool-summary", entry
            ? `${entry.measurement_date || "Ostatni pomiar"} · ${values} ${values === 1 ? "wartość" : "wartości"}`
            : "Brak zapisanych obwodów");
    }

    function renderEventGoal(goal, profile, error = null) {
        const name = document.getElementById("event-name");
        const date = document.getElementById("event-date");
        if (date) date.min = localDateOffset(1);
        if (error) {
            setText("event-tool-summary", "Odczyt niedostępny");
            if (eventProjection) eventProjection.hidden = true;
            return;
        }
        if (name) name.value = goal?.event_name || "";
        if (date) date.value = goal?.event_date || "";
        if (eventCurrentWeightInput) eventCurrentWeightInput.value = finiteNumber(profile?.current_weight_kg) === null ? "" : String(profile.current_weight_kg);
        if (eventGoalWeightInput) eventGoalWeightInput.value = finiteNumber(profile?.goal_weight_kg) === null ? "" : String(profile.goal_weight_kg);
        if (eventDeleteButton) eventDeleteButton.hidden = !goal;
        const projection = renderEventProjection();
        setText("event-tool-summary", goal
            ? `${goal.event_name} · ${projection ? `${projection.days} dni` : goal.event_date}`
            : "Ustaw cel z datą");
    }

    function setTriState(id, value) {
        const select = document.getElementById(id);
        if (select) select.value = value === true ? "true" : value === false ? "false" : "unknown";
    }

    function triStateValue(id) {
        const value = document.getElementById(id)?.value;
        return value === "true" ? true : value === "false" ? false : null;
    }

    function setCompletionState(id, complete, error = false) {
        const element = document.getElementById(id);
        if (!element) return;
        element.classList.toggle("complete", Boolean(complete) && !error);
        element.classList.toggle("state-error", Boolean(error));
    }

    function renderSafetyProfile(profile, error = null) {
        if (error) {
            currentSafetyProfileComplete = false;
            setText("safety-profile-state", "Odczyt niedostępny");
            setCompletionState("safety-profile-state", false, true);
            updateMealGenerationAccess();
            return;
        }
        setTriState("safety-pregnant", profile?.pregnant);
        setTriState("safety-breastfeeding", profile?.breastfeeding);
        setTriState("safety-eating-disorder", profile?.eating_disorder_risk);
        setTriState("safety-hypoglycemia", profile?.uses_hypoglycemia_medication);
        setTriState("safety-sglt2", profile?.uses_sglt2_inhibitor);
        const values = [profile?.pregnant, profile?.breastfeeding, profile?.eating_disorder_risk,
            profile?.uses_hypoglycemia_medication, profile?.uses_sglt2_inhibitor];
        const complete = Boolean(profile?.confirmed_at) && values.every((value) => typeof value === "boolean");
        currentSafetyProfileComplete = complete;
        setText("safety-profile-state", complete ? "Uzupełniony" : "Wymaga uzupełnienia");
        setCompletionState("safety-profile-state", complete);
        updateMealGenerationAccess();
    }

    function renderPreferenceFoods(preferences, catalog) {
        if (!preferenceFoodList) return;
        preferenceFoodList.replaceChildren();
        const foods = Array.isArray(catalog) ? catalog : [];
        if (!foods.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Katalog produktów DEV jest chwilowo niedostępny.";
            preferenceFoodList.append(empty);
            return;
        }
        const disliked = new Set(Array.isArray(preferences?.disliked_food_ids) ? preferences.disliked_food_ids : []);
        const preferred = new Set(Array.isArray(preferences?.preferred_food_ids) ? preferences.preferred_food_ids : []);
        foods.forEach((food, index) => {
            const row = document.createElement("div");
            row.className = "preference-food-row";
            const title = document.createElement("strong");
            title.textContent = food.name || "Produkt";
            row.append(title);
            const selected = disliked.has(food.id) ? "disliked" : preferred.has(food.id) ? "preferred" : "neutral";
            [["neutral", "Neutralny"], ["disliked", "Nie lubię"], ["preferred", "Lubię"]].forEach(([value, labelText]) => {
                const label = document.createElement("label");
                const input = document.createElement("input");
                input.type = "radio";
                input.name = `food-preference-${index}`;
                input.value = value;
                input.dataset.foodPreference = "";
                input.dataset.foodId = food.id;
                input.checked = selected === value;
                label.append(input, document.createTextNode(labelText));
                row.append(label);
            });
            preferenceFoodList.append(row);
        });
    }

    function renderMealPreferences(preferences, catalog, error = null) {
        currentMealPreferences = preferences || null;
        currentPreferenceCatalog = Array.isArray(catalog) ? catalog : [];
        if (error) {
            setText("preferences-state", "Odczyt niedostępny");
            setCompletionState("preferences-state", false, true);
            renderPreferenceFoods(null, []);
            updateMealGenerationAccess();
            return;
        }
        const allergens = new Set(Array.isArray(preferences?.allergen_keys) ? preferences.allergen_keys : []);
        document.querySelectorAll("[data-allergen]").forEach((input) => {
            input.checked = allergens.has(input.value);
        });
        const cook = document.getElementById("max-cook-minutes");
        if (cook) cook.value = finiteNumber(preferences?.max_cook_minutes) === null ? "" : String(preferences.max_cook_minutes);
        renderPreferenceFoods(preferences, currentPreferenceCatalog);
        setText("preferences-state", preferences?.complete ? "Uzupełnione" : "Wymagają uzupełnienia");
        setCompletionState("preferences-state", Boolean(preferences?.complete));
        updateMealGenerationAccess();
    }

    async function refreshAccountData() {
        if (!client || !activeUserId) return false;
        if (homeRefreshButton) {
            homeRefreshButton.disabled = true;
            homeRefreshButton.classList.add("loading");
        }
        const { data, error } = await client.auth.getUser();
        if (error || !data.user || data.user.id !== activeUserId) {
            if (homeRefreshButton) {
                homeRefreshButton.disabled = false;
                homeRefreshButton.classList.remove("loading");
            }
            return false;
        }
        await loadAccountData(data.user);
        if (homeRefreshButton) {
            homeRefreshButton.disabled = false;
            homeRefreshButton.classList.remove("loading");
        }
        return true;
    }

    async function recordHealthConsent() {
        if (!client || !activeUserId || !healthConsentCheckbox?.checked) return;
        healthConsentButton.disabled = true;
        healthConsentButton.textContent = "Zapisywanie…";
        setToolStatus("health-consent-status", "Zapisywanie zgody w DEV…");
        const { data, error } = await client.rpc("record_explicit_health_data_consent", {
            p_policy_version: CURRENT_PRIVACY_POLICY_VERSION,
            p_app_version: WEB_APP_VERSION,
            p_locale: "pl-PL"
        });
        healthConsentButton.textContent = "Zapisz zgodę";
        if (error || data?.recorded !== true) {
            healthConsentButton.disabled = false;
            setToolStatus("health-consent-status", healthWriteError(error, "Nie udało się zapisać zgody DEV."), "error");
            return;
        }
        healthConsentGranted = true;
        if (healthConsentPanel) healthConsentPanel.hidden = true;
        if (profileSetupConsent) {
            profileSetupConsent.checked = true;
            profileSetupConsent.disabled = true;
        }
        updateHealthToolsAvailability();
        setToolStatus("water-form-status", "Zgoda została zapisana. Możesz uzupełniać dane.", "success");
    }

    async function saveWater(amount) {
        if (!requireHealthWrite("water-form-status")) return;
        if (!Number.isInteger(amount) || amount < 50 || amount > 2000) {
            setToolStatus("water-form-status", "Wpisz od 50 do 2000 ml.", "error");
            return;
        }
        setToolFormBusy(waterForm, true);
        setToolStatus("water-form-status", "Zapisywanie wody w DEV…");
        const { error } = await client.rpc("log_water", { p_amount_ml: amount });
        if (error) {
            setToolFormBusy(waterForm, false);
            setToolStatus("water-form-status", healthWriteError(error, "Nie udało się zapisać wody."), "error");
            return;
        }
        await refreshAccountData();
        setToolFormBusy(waterForm, false);
        if (waterAmountInput) waterAmountInput.value = "";
        setToolStatus("water-form-status", `Dodano ${amount} ml wody.`, "success");
    }

    async function saveSteps(steps) {
        if (!requireHealthWrite("steps-form-status")) return;
        if (!Number.isInteger(steps) || steps < 0 || steps > 200000) {
            setToolStatus("steps-form-status", "Wpisz liczbę kroków od 0 do 200 000.", "error");
            return;
        }
        setToolFormBusy(stepsForm, true);
        setToolStatus("steps-form-status", "Zapisywanie kroków w DEV…");
        const { error } = await client.rpc("log_steps", { p_steps: steps });
        if (error) {
            setToolFormBusy(stepsForm, false);
            setToolStatus("steps-form-status", healthWriteError(error, "Nie udało się zapisać kroków."), "error");
            return;
        }
        await refreshAccountData();
        setToolFormBusy(stepsForm, false);
        setToolStatus("steps-form-status", `Zapisano ${numberFormatter.format(steps)} kroków na dzisiaj.`, "success");
    }

    function optionalMeasurement(id) {
        const value = document.getElementById(id)?.value.trim();
        if (!value) return null;
        const parsed = Number(value.replace(",", "."));
        return Number.isFinite(parsed) ? parsed : NaN;
    }

    async function saveMeasurements() {
        if (!requireHealthWrite("measurements-form-status")) return;
        const values = {
            p_waist_cm: optionalMeasurement("measurement-waist"),
            p_hips_cm: optionalMeasurement("measurement-hips"),
            p_chest_cm: optionalMeasurement("measurement-chest"),
            p_arm_cm: optionalMeasurement("measurement-arm"),
            p_thigh_cm: optionalMeasurement("measurement-thigh")
        };
        const entries = Object.values(values).filter((value) => value !== null);
        if (!entries.length) {
            setToolStatus("measurements-form-status", "Wpisz przynajmniej jeden obwód.", "error");
            return;
        }
        if (entries.some((value) => !Number.isFinite(value) || value < 10 || value > 300)) {
            setToolStatus("measurements-form-status", "Każdy obwód musi mieścić się w zakresie 10–300 cm.", "error");
            return;
        }
        setToolFormBusy(measurementsForm, true);
        setToolStatus("measurements-form-status", "Zapisywanie obwodów w DEV…");
        const { error } = await client.rpc("save_body_measurements", values);
        if (error) {
            setToolFormBusy(measurementsForm, false);
            setToolStatus("measurements-form-status", healthWriteError(error, "Nie udało się zapisać obwodów."), "error");
            return;
        }
        await refreshAccountData();
        setToolFormBusy(measurementsForm, false);
        setToolStatus("measurements-form-status", "Dzisiejsze obwody zostały zapisane.", "success");
    }

    async function saveEventGoal() {
        if (!requireHealthWrite("event-form-status")) return;
        const name = document.getElementById("event-name")?.value.trim() || "";
        const date = document.getElementById("event-date")?.value || "";
        const currentWeightKg = decimalInputValue(eventCurrentWeightInput);
        const goalWeightKg = decimalInputValue(eventGoalWeightInput);
        if (!name || name.length > 80 || !date) {
            setToolStatus("event-form-status", "Podaj nazwę wydarzenia i prawidłową datę.", "error");
            return;
        }
        if (date <= localToday()) {
            setToolStatus("event-form-status", "Data wydarzenia musi być późniejsza niż dzisiaj.", "error");
            return;
        }
        if (!eventProjectionResult(date, currentWeightKg, goalWeightKg)) {
            setToolStatus("event-form-status", "Podaj aktualną i docelową wagę od 30 do 350 kg. Aktualna waga musi być wyższa od docelowej.", "error");
            return;
        }
        setToolFormBusy(eventForm, true);
        setToolStatus("event-form-status", "Zapisywanie wydarzenia w DEV…");
        const { error } = await client.rpc("save_event_goal", { p_event_name: name, p_event_date: date });
        if (error) {
            setToolFormBusy(eventForm, false);
            setToolStatus("event-form-status", healthWriteError(error, "Nie udało się zapisać wydarzenia."), "error");
            return;
        }
        await refreshAccountData();
        if (eventCurrentWeightInput) eventCurrentWeightInput.value = String(currentWeightKg);
        if (eventGoalWeightInput) eventGoalWeightInput.value = String(goalWeightKg);
        renderEventProjection();
        setToolFormBusy(eventForm, false);
        setToolStatus("event-form-status", "Wydarzenie zapisano i obliczono orientacyjny wynik.", "success");
    }

    async function deleteEventGoal() {
        if (!requireHealthWrite("event-form-status")) return;
        setToolFormBusy(eventForm, true);
        setToolStatus("event-form-status", "Usuwanie wydarzenia z DEV…");
        const { error } = await client.rpc("delete_event_goal");
        if (error) {
            setToolFormBusy(eventForm, false);
            setToolStatus("event-form-status", healthWriteError(error, "Nie udało się usunąć wydarzenia."), "error");
            return;
        }
        await refreshAccountData();
        setToolFormBusy(eventForm, false);
        setToolStatus("event-form-status", "Wydarzenie zostało usunięte.", "success");
    }

    async function saveSafetyProfile() {
        if (!requireHealthWrite("safety-form-status")) return;
        setToolFormBusy(safetyForm, true);
        setToolStatus("safety-form-status", "Zapisywanie profilu bezpieczeństwa w DEV…");
        const { data, error } = await client.rpc("save_safety_profile", {
            p_pregnant: triStateValue("safety-pregnant"),
            p_breastfeeding: triStateValue("safety-breastfeeding"),
            p_eating_disorder_risk: triStateValue("safety-eating-disorder"),
            p_uses_hypoglycemia_medication: triStateValue("safety-hypoglycemia"),
            p_uses_sglt2_inhibitor: triStateValue("safety-sglt2")
        });
        if (error) {
            setToolFormBusy(safetyForm, false);
            setToolStatus("safety-form-status", healthWriteError(error, "Nie udało się zapisać profilu bezpieczeństwa."), "error");
            return;
        }
        await refreshAccountData();
        setToolFormBusy(safetyForm, false);
        setToolStatus("safety-form-status", data?.complete
            ? "Profil bezpieczeństwa został potwierdzony."
            : "Zapisano. Odpowiedź „Nie wiem” pozostawia profil niekompletny.", "success");
    }

    async function saveMealPreferences() {
        if (!requireHealthWrite("preferences-form-status")) return;
        const allergens = [...document.querySelectorAll("[data-allergen]:checked")].map((input) => input.value).sort();
        const selections = [...document.querySelectorAll("[data-food-preference]:checked")];
        const disliked = selections.filter((input) => input.value === "disliked").map((input) => input.dataset.foodId).sort();
        const preferred = selections.filter((input) => input.value === "preferred").map((input) => input.dataset.foodId).sort();
        const cookValue = document.getElementById("max-cook-minutes")?.value || "";
        const maxCook = cookValue ? Number(cookValue) : null;
        setToolFormBusy(preferencesForm, true);
        setToolStatus("preferences-form-status", "Zapisywanie alergii i preferencji w DEV…");
        const { data, error } = await client.rpc("save_meal_preferences", {
            p_allergen_keys: allergens,
            p_disliked_food_ids: disliked,
            p_preferred_food_ids: preferred,
            p_max_cook_minutes: maxCook
        });
        if (error) {
            setToolFormBusy(preferencesForm, false);
            setToolStatus("preferences-form-status", healthWriteError(error, "Nie udało się zapisać preferencji."), "error");
            return;
        }
        await refreshAccountData();
        setToolFormBusy(preferencesForm, false);
        setToolStatus("preferences-form-status", data?.archived_conflicting_plan
            ? "Preferencje zapisano. Poprzedni plan został wyłączony, ponieważ zawierał konflikt."
            : "Alergie i preferencje zostały zapisane.", "success");
    }

    function formatDiet(value) {
        const labels = { keto: "KETO", low_carb: "LOW CARB", balanced: "BALANCE" };
        return labels[String(value || "").toLowerCase()] || "—";
    }

    function formatGoal(value) {
        const labels = { reduction: "Redukcja", maintenance: "Utrzymanie", gain: "Budowa masy" };
        return labels[String(value || "").toLowerCase()] || "—";
    }

    function formatActivity(value) {
        const labels = {
            sedentary: "Niska", light: "Lekka", moderate: "Umiarkowana",
            active: "Wysoka", very_active: "Bardzo wysoka"
        };
        return labels[String(value || "").toLowerCase()] || String(value || "—");
    }

    function formatMealType(value) {
        const labels = {
            breakfast: "Śniadanie", lunch: "Obiad", dinner: "Kolacja",
            snack: "Przekąska", supper: "Kolacja"
        };
        return labels[String(value || "").toLowerCase()] || "Posiłek";
    }

    function renderDashboard(data) {
        currentDashboardSnapshot = data || null;
        const caloriesTarget = finiteNumber(data?.calories_target);
        const caloriesConsumed = finiteNumber(data?.calories_consumed) ?? 0;
        const remaining = caloriesTarget === null ? null : Math.max(0, caloriesTarget - caloriesConsumed);
        setText("home-calories-remaining", formatNumber(remaining));
        setText("home-calories-target", formatNumber(caloriesTarget));
        setText("home-calories-consumed", formatNumber(caloriesConsumed));
        setText("home-calories-total", formatNumber(caloriesTarget));
        setText("home-calories-detail", caloriesTarget === null ? "Brak celu" : `/ ${formatNumber(caloriesTarget)} kcal`);
        setProgress("home-calories-bar", caloriesConsumed, caloriesTarget);

        setText("home-current-weight", formatWeight(data?.current_weight_kg));
        setText("home-goal-weight", formatWeight(data?.goal_weight_kg));
        setText("home-next-milestone", formatWeight(data?.first_milestone_kg ?? data?.goal_weight_kg));
        setText("home-water", formatNumber(data?.water_ml));
        setText("home-steps", formatNumber(data?.steps));
        setText("water-tool-summary", `${formatNumber(data?.water_ml)} ml dzisiaj`);
        setText("steps-tool-summary", `${formatNumber(data?.steps)} kroków dzisiaj`);
        if (stepsAmountInput && document.activeElement !== stepsAmountInput) {
            stepsAmountInput.value = finiteNumber(data?.steps) === null ? "" : String(data.steps);
        }

        const macroRows = [
            ["protein", data?.protein_consumed, data?.protein_target],
            ["fat", data?.fat_consumed, data?.fat_target],
            ["carbs", data?.carbs_consumed, data?.carbs_target]
        ];
        macroRows.forEach(([name, consumed, target]) => {
            setText(`home-${name}`, `${formatNumber(consumed)} / ${formatNumber(target)} g`);
            const consumedValue = finiteNumber(consumed);
            const targetValue = finiteNumber(target);
            const percent = consumedValue === null || targetValue === null || targetValue <= 0
                ? null
                : Math.round((consumedValue / targetValue) * 100);
            setText(`home-${name}-percent`, percent === null ? "—" : `${percent}%`);
            setProgress(`home-${name}-bar`, consumed, target);
        });

        const weightProgress = finiteNumber(data?.goal_progress_percent);
        setText("home-weight-progress", weightProgress === null ? "—" : `${formatNumber(weightProgress)}%`);
        setProgress("home-weight-progress-bar", weightProgress, 100);
        const change = finiteNumber(data?.change_from_start_kg);
        const average = finiteNumber(data?.average_7d);
        const start = finiteNumber(data?.start_weight_kg);
        setText("home-start-weight", start === null ? "—" : `${formatWeight(start)} kg`);
        setText("home-average-weight", average === null ? "—" : `${formatWeight(average)} kg`);
        setText("home-weight-change", change === null
            ? "—"
            : change > 0
                ? `−${formatWeight(change)} kg`
                : change < 0
                    ? `+${formatWeight(-change)} kg`
                    : "0,0 kg");
        const details = [];
        if (change !== null) details.push(`Zmiana od startu: ${weightFormatter.format(change)} kg`);
        if (average !== null) details.push(`Średnia 7 dni: ${weightFormatter.format(average)} kg`);
        setText("home-weight-detail", details.join(" · ") || "Brak zapisów wagi z ostatnich 7 dni");

        dashboardOverview?.setAttribute("aria-busy", "false");
        setText("dashboard-message", "Dane obliczone przez tę samą funkcję DEV co w Androidzie.");
        setText("home-data-status", "Połączono");
        setText("home-data-detail", "Aktualne dane własnego konta DEV");
        setStatusCard("dashboard-status-card", "ready");
    }

    function profileSetupValue(id, fallback = "") {
        const element = document.getElementById(id);
        return element ? element.value : fallback;
    }

    function setProfileSetupValue(id, value, fallback = "") {
        const element = document.getElementById(id);
        if (element) element.value = value === null || value === undefined || value === "" ? fallback : String(value);
    }

    function syncProfileSetupGoal() {
        const maintenance = profileSetupGoalType?.value === "maintenance";
        if (profileSetupAdjustmentField) profileSetupAdjustmentField.hidden = maintenance;
        if (profileSetupAdjustment) profileSetupAdjustment.disabled = maintenance || profileSetupBusy;
    }

    function setProfileSetupBusy(busy) {
        profileSetupBusy = busy;
        profileSetupForm?.querySelectorAll("input, select, button").forEach((control) => {
            control.disabled = busy;
        });
        if (profileSetupSubmit) profileSetupSubmit.textContent = busy ? "Wyliczanie planu…" : "Utwórz profil i wylicz plan";
        if (profileSetupConsent) profileSetupConsent.disabled = busy || healthConsentGranted;
        syncProfileSetupGoal();
    }

    function renderProfileSetup(profile, plan, profileError = null, planError = null) {
        if (!profileSetupPanel || !profileSetupForm) return false;
        const needsSetup = !profileError && !planError && (!profile?.onboarding_completed || !plan);
        profileSetupPanel.hidden = !needsSetup;
        if (!needsSetup) return false;

        if (profileSetupForm.dataset.prefilledFor !== activeUserId) {
            setProfileSetupValue("setup-current-weight", profile?.current_weight_kg);
            setProfileSetupValue("setup-goal-weight", profile?.goal_weight_kg);
            setProfileSetupValue("setup-goal-type", profile?.goal_type, "reduction");
            const adjustment = [10, 15, 20].includes(Number(profile?.energy_adjustment_percent))
                ? Number(profile.energy_adjustment_percent)
                : 15;
            setProfileSetupValue("setup-energy-adjustment", adjustment, "15");
            setProfileSetupValue("setup-sex", profile?.sex_for_calculations, "male");
            setProfileSetupValue("setup-age", profile?.age_years);
            setProfileSetupValue("setup-height", profile?.height_cm);
            setProfileSetupValue("setup-diet", profile?.diet_type, "keto");
            setProfileSetupValue("setup-meals", profile?.meals_per_day, "3");
            setProfileSetupValue("setup-activity", profile?.activity_level, "moderate");
            setProfileSetupValue("setup-strength-days", profile?.strength_training_days, "3");
            setProfileSetupValue("setup-average-steps", profile?.average_steps, "8000");
            setProfileSetupValue("setup-main-challenge", profile?.main_challenge, "weekend");
            profileSetupForm.dataset.prefilledFor = activeUserId || "signed-in";
        }
        if (profileSetupConsent) profileSetupConsent.checked = healthConsentGranted || profileSetupConsent.checked;
        setProfileSetupBusy(false);
        setToolStatus("profile-setup-status", profile
            ? "Uzupełnij brakujące dane i utwórz aktywny plan DEV."
            : "Uzupełnij wszystkie pola. Po zatwierdzeniu utworzymy profil i aktywny plan DEV.");
        return true;
    }

    function initialPlanErrorMessage(code) {
        const normalized = String(code || "unknown_error").toLowerCase();
        const messages = {
            unauthorized: "Sesja wygasła. Zaloguj się ponownie.",
            authentication_required: "Sesja wygasła. Zaloguj się ponownie.",
            invalid_payload: "Sprawdź dane formularza.",
            invalid_sex: "Wybierz płeć używaną do obliczeń.",
            invalid_age: "Wiek musi mieścić się w zakresie 18–99 lat.",
            invalid_height: "Wzrost musi mieścić się w zakresie 120–230 cm.",
            invalid_weight: "Aktualna waga musi mieścić się w zakresie 35–350 kg.",
            invalid_goal: "Waga docelowa musi mieścić się w zakresie 35–350 kg.",
            invalid_diet: "Wybierz KETO, LOW CARB albo BALANCE.",
            invalid_activity: "Wybierz poziom codziennej aktywności.",
            invalid_meals: "Wybierz od 2 do 5 posiłków dziennie.",
            invalid_training: "Podaj od 0 do 7 treningów siłowych tygodniowo.",
            invalid_goal_type: "Wybierz prawidłowy cel energetyczny.",
            invalid_energy_adjustment: "Wybierz 10%, 15% albo 20%.",
            safety_lock: "Tego planu nie można utworzyć automatycznie ze względów bezpieczeństwa. Sprawdź dane i nie obniżaj samodzielnie kalorii.",
            macro_target_conflict: "Nie udało się bezpiecznie dopasować makro do podanych danych.",
            keto_target_service_unavailable: "Wyliczenie celu KETO jest chwilowo niedostępne.",
            low_carb_target_service_unavailable: "Wyliczenie celu LOW CARB jest chwilowo niedostępne.",
            balanced_target_service_unavailable: "Wyliczenie celu BALANCE jest chwilowo niedostępne.",
            nutrition_plan_unavailable: "Nie udało się utworzyć aktywnego planu DEV."
        };
        return messages[normalized] || "Nie udało się utworzyć profilu i planu DEV. Spróbuj ponownie.";
    }

    function initialProfilePayload() {
        const goalType = profileSetupValue("setup-goal-type");
        return {
            sex: profileSetupValue("setup-sex"),
            age: Number(profileSetupValue("setup-age")),
            height_cm: Number(profileSetupValue("setup-height")),
            current_weight_kg: Number(profileSetupValue("setup-current-weight")),
            goal_weight_kg: Number(profileSetupValue("setup-goal-weight")),
            diet_type: profileSetupValue("setup-diet"),
            meals_per_day: Number(profileSetupValue("setup-meals")),
            activity_level: profileSetupValue("setup-activity"),
            strength_training_days: Number(profileSetupValue("setup-strength-days")),
            average_steps: Number(profileSetupValue("setup-average-steps")),
            weekly_budget_eur: null,
            main_challenge: profileSetupValue("setup-main-challenge"),
            goal_type: goalType,
            energy_adjustment_percent: goalType === "maintenance" ? 0 : Number(profileSetupValue("setup-energy-adjustment")),
            carb_limit_g: null,
            coach_reference_weight_kg: null,
            meal_calorie_tolerance_percent: 8,
            meal_macro_tolerance_percent: 4,
            clinical_override_required: false,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        };
    }

    function validInitialProfilePayload(payload) {
        return ["male", "female"].includes(payload.sex) &&
            Number.isInteger(payload.age) && payload.age >= 18 && payload.age <= 99 &&
            Number.isFinite(payload.height_cm) && payload.height_cm >= 120 && payload.height_cm <= 230 &&
            Number.isFinite(payload.current_weight_kg) && payload.current_weight_kg >= 35 && payload.current_weight_kg <= 350 &&
            Number.isFinite(payload.goal_weight_kg) && payload.goal_weight_kg >= 35 && payload.goal_weight_kg <= 350 &&
            ["keto", "low_carb", "balanced"].includes(payload.diet_type) &&
            Number.isInteger(payload.meals_per_day) && payload.meals_per_day >= 2 && payload.meals_per_day <= 5 &&
            ["very_low", "low", "light", "moderate", "high", "very_high"].includes(payload.activity_level) &&
            Number.isInteger(payload.strength_training_days) && payload.strength_training_days >= 0 && payload.strength_training_days <= 7 &&
            Number.isInteger(payload.average_steps) && payload.average_steps >= 0 && payload.average_steps <= 100000 &&
            ["weekend", "evening_hunger", "sweets", "time", "eating_out"].includes(payload.main_challenge) &&
            ["reduction", "maintenance", "gain"].includes(payload.goal_type) &&
            (payload.goal_type === "maintenance" || [10, 15, 20].includes(payload.energy_adjustment_percent));
    }

    async function recoverInitialPlan() {
        const [profileResult, planResult] = await Promise.all([
            client.from("profiles").select("onboarding_completed").eq("user_id", activeUserId).maybeSingle(),
            client.from("nutrition_plans").select("calories_target,protein_g,fat_g,carbs_g,diet_type,status,version")
                .eq("user_id", activeUserId).eq("status", "active").order("version", { ascending: false }).limit(1).maybeSingle()
        ]);
        if (profileResult.error || planResult.error || !profileResult.data?.onboarding_completed || !planResult.data) return null;
        return planResult.data;
    }

    async function createInitialPlanWithRecovery(payload) {
        let lastCode = "unknown_error";
        for (let attempt = 0; attempt < 3; attempt += 1) {
            const { data, error } = await client.functions.invoke("create-initial-plan", { body: payload });
            if (!error && !data?.error) return { data, recovered: false };
            lastCode = await edgeFunctionErrorCode(error, data);
            const recoveredPlan = await recoverInitialPlan();
            if (recoveredPlan) return { data: recoveredPlan, recovered: true };
            if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 1200));
        }
        return { errorCode: lastCode };
    }

    async function submitInitialProfile() {
        if (!client || !activeUserId || profileSetupBusy) return;
        if (!profileSetupForm?.reportValidity()) return;
        const payload = initialProfilePayload();
        if (!validInitialProfilePayload(payload)) {
            setToolStatus("profile-setup-status", "Sprawdź wszystkie pola konfiguracji startowej.", "error");
            return;
        }
        if (!healthConsentGranted && !profileSetupConsent?.checked) {
            setToolStatus("profile-setup-status", "Zaznacz zgodę na przetwarzanie danych potrzebnych do utworzenia planu.", "error");
            return;
        }

        setProfileSetupBusy(true);
        setToolStatus("profile-setup-status", "Zapisywanie zgody i wyliczanie planu DEV. To może potrwać kilkadziesiąt sekund…");
        if (!healthConsentGranted) {
            const consentResult = await client.rpc("record_explicit_health_data_consent", {
                p_policy_version: CURRENT_PRIVACY_POLICY_VERSION,
                p_app_version: WEB_APP_VERSION,
                p_locale: "pl-PL"
            });
            if (consentResult.error || consentResult.data?.recorded !== true) {
                setProfileSetupBusy(false);
                setToolStatus("profile-setup-status", healthWriteError(consentResult.error, "Nie udało się zapisać zgody DEV."), "error");
                return;
            }
            healthConsentGranted = true;
            if (healthConsentPanel) healthConsentPanel.hidden = true;
            if (healthConsentCheckbox) healthConsentCheckbox.checked = true;
        }

        const result = await createInitialPlanWithRecovery(payload);
        if (result.errorCode) {
            setProfileSetupBusy(false);
            setToolStatus("profile-setup-status", initialPlanErrorMessage(result.errorCode), "error");
            return;
        }

        const refreshed = await refreshAccountData();
        setProfileSetupBusy(false);
        if (!refreshed) {
            setToolStatus("profile-setup-status", "Plan został wysłany do wyliczenia, ale sesja wymaga odświeżenia.", "error");
            return;
        }
        const calories = finiteNumber(result.data?.target_kcal ?? result.data?.calories ?? result.data?.calories_target);
        const detail = calories === null ? "Profil i aktywny plan DEV są gotowe." : `Profil i aktywny plan są gotowe: ${formatNumber(calories)} kcal.`;
        setText("profile-data-message", detail);
        profileDataPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderProfile(profile, plan) {
        if (!profile) {
            profileReadyForWrites = false;
            updateHealthToolsAvailability();
            profileDataPanel?.setAttribute("aria-busy", "false");
            setText("profile-data-message", "Brak profilu. Uzupełnij konfigurację startową powyżej.");
            setText("home-profile-status", "Brak profilu");
            setText("home-profile-detail", "Wymagane dokończenie konfiguracji DEV");
            setStatusCard("profile-status-card", "error");
            return;
        }

        profileReadyForWrites = Boolean(profile.onboarding_completed);
        updateHealthToolsAvailability();

        setText("profile-onboarding", profile.onboarding_completed ? "Ukończony" : "Niedokończony");
        setText("profile-diet", formatDiet(profile.diet_type));
        setText("profile-goal", formatGoal(profile.goal_type));
        setText("profile-meals", formatNumber(profile.meals_per_day));
        setText("profile-start-weight", `${formatWeight(profile.start_weight_kg)} kg`);
        setText("profile-current-weight", `${formatWeight(profile.current_weight_kg)} kg`);
        setText("profile-goal-weight", `${formatWeight(profile.goal_weight_kg)} kg`);
        setText("profile-activity", formatActivity(profile.activity_level));
        setText("profile-strength", `${formatNumber(profile.strength_training_days)} dni / tydz.`);
        setText("profile-average-steps", formatNumber(profile.average_steps));
        setText("profile-timezone", profile.timezone || "—");
        setText("profile-plan-status", plan
            ? `${formatDiet(plan.diet_type)} · ${formatNumber(plan.calories_target)} kcal · B ${formatNumber(plan.protein_g)} / T ${formatNumber(plan.fat_g)} / W ${formatNumber(plan.carbs_g)} g`
            : "Brak aktywnego planu");
        profileDataPanel?.setAttribute("aria-busy", "false");
        setText("profile-data-message", "Dane tylko do odczytu, chronione polityką RLS.");
        setText("home-profile-status", profile.onboarding_completed ? "Gotowy" : "Nieukończony");
        setText("home-profile-detail", profile.onboarding_completed
            ? `${formatDiet(profile.diet_type)} · ${formatGoal(profile.goal_type)}`
            : "Dokończ konfigurację profilu DEV");
        setStatusCard("profile-status-card", profile.onboarding_completed ? "ready" : "error");
    }

    function historyRow(title, subtitle, value) {
        const row = document.createElement("div");
        row.className = "history-row";
        const copy = document.createElement("div");
        const strong = document.createElement("strong");
        const small = document.createElement("small");
        const result = document.createElement("span");
        strong.textContent = title;
        small.textContent = subtitle;
        result.textContent = value;
        copy.append(strong, small);
        row.append(copy, result);
        return row;
    }

    function renderWeightHistory(rows) {
        const list = document.getElementById("weight-history-list");
        if (!list) return;
        list.replaceChildren();
        const entries = Array.isArray(rows) ? rows : [];
        setText("weight-history-count", formatNumber(entries.length));
        if (!entries.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Brak zapisów wagi na koncie DEV.";
            list.append(empty);
            return;
        }
        entries.forEach((entry) => {
            list.append(historyRow(
                formatDate(entry.measured_at, true),
                entry.source === "manual" ? "Pomiar ręczny" : "Źródło: aplikacja DEV",
                `${formatWeight(entry.weight_kg)} kg`
            ));
        });
    }

    function renderStepsHistory(rows) {
        const list = document.getElementById("steps-history-list");
        if (!list) return;
        list.replaceChildren();
        const entries = (Array.isArray(rows) ? rows : []).filter((entry) =>
            (finiteNumber(entry.steps) ?? 0) > 0 || (finiteNumber(entry.water_ml) ?? 0) > 0 || entry.wellbeing_score !== null
        );
        setText("steps-history-count", formatNumber(entries.length));
        if (!entries.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Brak zapisanej aktywności z ostatnich 7 dni.";
            list.append(empty);
            return;
        }
        entries.forEach((entry) => {
            const details = [];
            if ((finiteNumber(entry.water_ml) ?? 0) > 0) details.push(`${formatNumber(entry.water_ml)} ml wody`);
            if (entry.wellbeing_score !== null) details.push(`samopoczucie ${formatNumber(entry.wellbeing_score)}/5`);
            list.append(historyRow(
                formatDate(entry.summary_date),
                details.join(" · ") || "Dane aktywności DEV",
                `${formatNumber(entry.steps)} kroków`
            ));
        });
    }

    function renderWeeklyProgress(report) {
        setText("progress-data-days", `${formatNumber(report?.data_days)} / 7`);
        setText("progress-meals", formatNumber(report?.meals_logged));
        setText("progress-calories", formatNumber(report?.average_calories));
        setText("progress-steps", formatNumber(report?.average_steps));
        setText("progress-water", formatNumber(report?.average_water_ml));
        const change = finiteNumber(report?.weight_change_kg);
        setText("progress-weight-change", change === null
            ? "—"
            : `${change > 0 ? "+" : ""}${weightFormatter.format(change)}`);
        document.getElementById("progress-summary")?.setAttribute("aria-busy", "false");
        const period = report?.period_start && report?.period_end
            ? `${formatDate(report.period_start)} – ${formatDate(report.period_end)}`
            : "ostatnie 7 dni";
        setText("progress-message", `Raport DEV: ${period}. Wartości wylicza backend aplikacji.`);
    }

    function renderTodayMeals(rows) {
        const list = document.getElementById("today-meals-list");
        if (!list) return;
        list.replaceChildren();
        const meals = Array.isArray(rows) ? rows : [];
        setText("today-meals-count", formatNumber(meals.length));
        const calories = meals.reduce((sum, meal) => sum + (finiteNumber(meal.calories) ?? 0), 0);
        setText("meals-calories-total", formatNumber(calories));
        if (!meals.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Nie zapisano dziś żadnego posiłku na koncie DEV.";
            list.append(empty);
            setText("meals-message", "Dziennik DEV jest pusty na dziś.");
            return;
        }
        meals.forEach((meal) => {
            const card = document.createElement("article");
            card.className = "meal-log-card";
            const top = document.createElement("div");
            top.className = "meal-log-top";
            const copy = document.createElement("div");
            const title = document.createElement("h4");
            const items = document.createElement("p");
            const kcal = document.createElement("strong");
            title.textContent = formatMealType(meal.meal_type);
            items.textContent = (Array.isArray(meal.items) ? meal.items : []).map((item) => item.name).join(", ") || "Bez listy składników";
            kcal.textContent = `${formatNumber(meal.calories)} kcal`;
            copy.append(title, items);
            top.append(copy, kcal);
            const macros = document.createElement("div");
            macros.className = "meal-macros";
            [
                `B ${formatNumber(meal.protein_g)} g`,
                `T ${formatNumber(meal.fat_g)} g`,
                `W ${formatNumber(meal.carbs_g)} g`,
                formatDate(meal.eaten_at, true)
            ].forEach((value) => {
                const span = document.createElement("span");
                span.textContent = value;
                macros.append(span);
            });
            card.append(top, macros);
            list.append(card);
        });
        setText("meals-message", "Dzisiejszy dziennik pobrany z DEV.");
    }

    function mealPlanDay(dayIndex) {
        return currentMealPlan?.days?.find((entry) => Number(entry.day_index) === dayIndex) || null;
    }

    function mealPlanActionBusy() {
        return mealPlanGenerating || Boolean(mealPlanSwappingId) || Boolean(mealPlanLoggingId);
    }

    function planFoodName(value) {
        const clean = String(value || "").trim().replace(/\s+/g, " ");
        const lower = clean.toLocaleLowerCase("pl-PL");
        if (lower.startsWith("majonez")) return "Majonez";
        if (lower.startsWith("masło ekstra") || lower.startsWith("maslo ekstra")) return "Masło";
        return clean
            .replace(/\b(Koral|Winiary|Hellmann'?s|Kotlin|Pudliszki)\b/gi, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function formatShoppingQuantity(value) {
        const grams = finiteNumber(value);
        if (grams === null || grams <= 0) return "0 g";
        if (grams >= 1000) {
            return `${new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 }).format(grams / 1000)} kg`;
        }
        return `${formatNumber(grams)} g`;
    }

    function planElement(tag, className = "", textContent = "") {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }

    function mealSwapRequirement() {
        if (!client || !activeUserId) return "Sesja wygasła. Zaloguj się ponownie.";
        if (!currentPremiumSnapshot?.meal_plan_allowed) return "Zamiany posiłków wymagają aktywnego dostępu PRO.";
        if (currentMealPreferences?.complete !== true) return "Najpierw zapisz alergie i preferencje na Home.";
        if (currentPremiumSnapshot?.meal_swap_allowed !== true) return "Dzisiejszy limit zamian posiłków został wykorzystany.";
        return null;
    }

    function mealPlanGenerationRequirement(dayIndex) {
        if (!client || !activeUserId) return "Sesja wygasła. Zaloguj się ponownie.";
        if (!profileReadyForWrites) return "Najpierw dokończ profil Project Weight Drop DEV.";
        if (!healthConsentGranted) return "Najpierw zapisz zgodę na dane zdrowotne na Home.";
        if (!currentNutritionPlan) return "Brak aktywnego planu kalorii i makro. Najpierw dokończ konfigurację planu.";
        if (premiumSnapshotUnavailable || !currentPremiumSnapshot) return "Nie udało się sprawdzić dostępu PRO. Odśwież stronę i spróbuj ponownie.";
        if (!currentPremiumSnapshot.meal_plan_allowed) return "Generowanie planu 7 dni wymaga aktywnego dostępu PRO.";
        if (!currentSafetyProfileComplete) return "Najpierw uzupełnij profil bezpieczeństwa na Home.";
        if (currentMealPreferences?.complete !== true) return "Najpierw zapisz alergie i preferencje na Home — również wtedy, gdy nie masz alergii.";
        if (mealPlanDay(dayIndex) && currentPremiumSnapshot?.meal_day_regeneration_allowed !== true) {
            return "Dzisiejszy limit ponownego generowania dni został wykorzystany.";
        }
        return null;
    }

    function updateMealGenerationAccess() {
        const premium = currentPremiumSnapshot;
        let title = "Sprawdzanie dostępu…";
        let copy = "Plan korzysta z aktywnej diety, kalorii, makro i zabezpieczeń konta DEV.";
        let quota = "—";
        if (premiumSnapshotUnavailable) {
            title = "Nie udało się sprawdzić dostępu PRO";
            copy = "Odśwież stronę i spróbuj ponownie.";
            quota = "BŁĄD ODCZYTU";
        } else if (premium) {
            if (!premium.meal_plan_allowed) {
                title = "Plan 7 dni jest dostępny w PRO";
                copy = "Aktywuj PRO w aplikacji Android, aby generować dni planu także w przeglądarce.";
                quota = "FREE";
            } else if (!profileReadyForWrites) {
                title = "Dokończ profil Project Weight Drop";
                copy = "Aktywny profil DEV jest wymagany do użycia planu kalorii i makro.";
                quota = "WYMAGANE";
            } else if (!healthConsentGranted) {
                title = "Zapisz zgodę na dane zdrowotne";
                copy = "Zgoda na Home jest wymagana przed generowaniem planu w przeglądarce.";
                quota = "WYMAGANE";
            } else if (!currentSafetyProfileComplete) {
                title = "Uzupełnij profil bezpieczeństwa";
                copy = "Odpowiedz na wszystkie pytania bezpieczeństwa na Home przed generowaniem.";
                quota = "WYMAGANE";
            } else if (currentMealPreferences?.complete !== true) {
                title = "Potwierdź alergie i preferencje";
                copy = "Zapisz formularz na Home, nawet jeżeli nie masz alergii ani wykluczeń.";
                quota = "WYMAGANE";
            } else if (!currentNutritionPlan) {
                title = "Brak aktywnego planu kalorii i makro";
                copy = "Najpierw dokończ konfigurację planu Project Weight Drop DEV.";
                quota = "BRAK PLANU";
            } else {
                title = `Gotowe do generowania · ${formatDiet(currentNutritionPlan.diet_type)}`;
                copy = "Każdy dzień powstaje osobno z tych samych ustawień i zabezpieczeń co w Androidzie.";
                quota = premium.admin_granted
                    ? "ADMIN · BEZ LIMITU"
                    : `DZIEŃ ${formatNumber(premium.meal_day_regeneration_remaining)}/${formatNumber(premium.meal_day_regeneration_limit)} · POSIŁKI ${formatNumber(premium.meal_swap_remaining)}/${formatNumber(premium.meal_swap_limit)}`;
            }
        }
        setText("meal-plan-access-title", title);
        setText("meal-plan-access-copy", copy);
        setText("meal-plan-quota", quota);
        document.querySelectorAll("[data-generate-meal-day]").forEach((button) => {
            button.disabled = mealPlanActionBusy();
            if (mealPlanGenerating && Number(button.dataset.generateMealDay) === selectedMealPlanDay) {
                button.textContent = `Przemala układa dzień ${selectedMealPlanDay + 1}…`;
            }
        });
    }

    function mealGenerationButton(dayIndex, regenerate = false) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = regenerate ? "meal-plan-regenerate" : "meal-plan-generate";
        button.dataset.generateMealDay = String(dayIndex);
        button.textContent = regenerate ? `Wygeneruj ponownie dzień ${dayIndex + 1}` : `Wygeneruj dzień ${dayIndex + 1}`;
        button.addEventListener("click", () => void generateMealPlanDay(dayIndex));
        return button;
    }

    function renderMealPlanDaySummary(day) {
        const card = planElement("section", "meal-plan-day-summary");
        card.setAttribute("aria-label", `Podsumowanie dnia ${Number(day.day_index) + 1}`);
        const heading = planElement(
            "h3",
            "",
            `Dzień ${Number(day.day_index) + 1} - ${formatMacro(day.calories)} / ${formatNumber(currentMealPlan?.calories_target)} kcal`
        );
        const macros = planElement("div", "meal-plan-summary-macros");
        [
            ["Białko", `${formatMacro(day.protein_g)} g`, "protein"],
            ["Tłuszcz", `${formatMacro(day.fat_g)} g`, "fat"],
            ["Węgle", `${formatMacro(day.carbs_g)} g`, "carbs"]
        ].forEach(([label, value, kind]) => {
            const pill = planElement("div", `meal-plan-macro-pill ${kind}`);
            pill.append(planElement("span", "", label), planElement("strong", "", value));
            macros.append(pill);
        });
        const progress = planElement("div", "meal-plan-day-progress");
        const target = finiteNumber(currentMealPlan?.calories_target) ?? 0;
        const calories = finiteNumber(day.calories) ?? 0;
        const percent = target > 0 ? Math.min(100, Math.max(0, (calories / target) * 100)) : 0;
        progress.setAttribute("role", "progressbar");
        progress.setAttribute("aria-valuemin", "0");
        progress.setAttribute("aria-valuemax", String(target || 100));
        progress.setAttribute("aria-valuenow", String(Math.round(calories)));
        const progressValue = planElement("span");
        progressValue.style.width = `${percent}%`;
        progress.append(progressValue);
        card.append(heading, macros, progress);
        if (String(currentMealPlan?.diet_type || "").toLowerCase() === "keto") {
            card.append(planElement(
                "p",
                "meal-plan-keto-line",
                `Błonnik ${formatMacro(day.fiber_g)} g · Węglowodany netto ${formatMacro(day.net_carbs_g)} g`
            ));
        }
        return card;
    }

    function renderMealPlanMealCard(meal) {
        const mealId = String(meal.id || "");
        const expanded = expandedMealPlanIds.has(mealId);
        const locked = lockedMealPlanIds.has(mealId);
        const eaten = meal.eaten_today === true;
        const card = planElement("article", `meal-plan-card${expanded ? " expanded" : ""}`);

        const top = planElement("div", "meal-plan-card-top");
        top.append(planElement("h4", "", formatMealType(meal.meal_type)));
        const logButton = planElement(
            "button",
            `meal-plan-log${eaten ? " complete" : ""}`,
            mealPlanLoggingId === mealId ? "Dodawanie…" : eaten ? "✓ Dodano do dzisiaj" : "✓ Zjedzone — dodaj do dzisiaj"
        );
        logButton.type = "button";
        logButton.dataset.logMeal = mealId;
        logButton.disabled = eaten || mealPlanActionBusy();
        logButton.addEventListener("click", () => void logMealPlanMealToday(mealId));
        top.append(logButton);

        const title = planElement("p", "meal-plan-meal-title", meal.title || "Posiłek");
        const macroLine = planElement(
            "p",
            "meal-plan-meal-macros",
            `${formatNumber(meal.calories)} kcal · Białko ${formatMacro(meal.protein_g)} g · Tłuszcz ${formatMacro(meal.fat_g)} g · Węgle ${formatMacro(meal.carbs_g)} g`
        );
        card.append(top, title, macroLine);
        if (String(currentMealPlan?.diet_type || "").toLowerCase() === "keto") {
            card.append(planElement(
                "p",
                "meal-plan-keto-line",
                `Błonnik ${formatMacro(meal.fiber_g)} g · Netto ${formatMacro(meal.net_carbs_g)} g`
            ));
        }

        const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];
        const toggle = planElement("button", "meal-plan-expand");
        toggle.type = "button";
        toggle.setAttribute("aria-expanded", String(expanded));
        toggle.append(
            planElement("span", "meal-plan-chevron", expanded ? "⌄" : "›"),
            planElement("span", "", `Składniki (${ingredients.length})`)
        );
        toggle.addEventListener("click", () => {
            if (expandedMealPlanIds.has(mealId)) expandedMealPlanIds.delete(mealId);
            else expandedMealPlanIds.add(mealId);
            renderMealPlanDay(selectedMealPlanDay);
        });
        card.append(toggle);

        const details = planElement("div", "meal-plan-card-details");
        details.hidden = !expanded;
        const ingredientList = planElement("div", "meal-plan-ingredients");
        ingredients.forEach((ingredient) => {
            const row = planElement("div", "meal-plan-ingredient");
            row.append(
                planElement("span", "", planFoodName(ingredient.food_name) || "Składnik"),
                planElement("strong", "", `${formatMacro(ingredient.grams)} g`)
            );
            ingredientList.append(row);
        });
        if (!ingredients.length) ingredientList.append(planElement("p", "meal-plan-no-ingredients", "Brak listy składników."));
        details.append(ingredientList);
        const instructions = String(meal.preparation_instructions || "").trim();
        if (instructions) {
            const preparation = planElement("section", "meal-plan-preparation");
            preparation.append(
                planElement("h5", "", `Sposób przygotowania · ${formatNumber(meal.estimated_prep_minutes)} min`),
                planElement("p", "", instructions)
            );
            details.append(preparation);
        }
        card.append(details);

        const actions = planElement("div", "meal-plan-card-actions");
        const swapRequirement = mealSwapRequirement();
        const swapButton = planElement(
            "button",
            "meal-plan-link-action swap",
            mealPlanSwappingId === mealId
                ? "Zamieniam posiłek…"
                : swapRequirement && currentPremiumSnapshot?.meal_swap_allowed === false
                    ? "Limit wykorzystany"
                    : "Zamień ten posiłek ›"
        );
        swapButton.type = "button";
        swapButton.dataset.swapMeal = mealId;
        swapButton.disabled = Boolean(swapRequirement) || mealPlanActionBusy();
        swapButton.title = swapRequirement || "Zamień tylko ten posiłek i zachowaj resztę dnia";
        swapButton.addEventListener("click", () => void swapMealPlanMeal(mealId));

        const lockButton = planElement("button", `meal-plan-link-action lock${locked ? " active" : ""}`, locked ? "✓ Zachowany" : "Zachowaj");
        lockButton.type = "button";
        lockButton.dataset.lockMeal = mealId;
        lockButton.setAttribute("aria-pressed", String(locked));
        lockButton.disabled = mealPlanActionBusy();
        lockButton.addEventListener("click", () => {
            if (lockedMealPlanIds.has(mealId)) lockedMealPlanIds.delete(mealId);
            else lockedMealPlanIds.add(mealId);
            renderMealPlanDay(selectedMealPlanDay);
        });
        actions.append(swapButton, lockButton);
        card.append(actions);
        return card;
    }

    function renderMealPlanShoppingList(day) {
        const wrapper = planElement("div", "meal-plan-shopping-wrap");
        const button = planElement("button", "meal-plan-shopping-toggle", mealPlanShoppingOpen ? "Ukryj listę zakupów" : "Lista zakupów");
        button.type = "button";
        button.setAttribute("aria-expanded", String(mealPlanShoppingOpen));
        button.addEventListener("click", () => {
            mealPlanShoppingOpen = !mealPlanShoppingOpen;
            renderMealPlanDay(selectedMealPlanDay);
        });
        wrapper.append(button);
        if (!mealPlanShoppingOpen) return wrapper;

        const aggregated = new Map();
        (Array.isArray(day.meals) ? day.meals : []).forEach((meal) => {
            (Array.isArray(meal.ingredients) ? meal.ingredients : []).forEach((ingredient) => {
                const name = planFoodName(ingredient.food_name);
                const key = String(ingredient.food_id || name).toLowerCase();
                if (!name || !key) return;
                const current = aggregated.get(key) || { name, grams: 0 };
                current.grams += finiteNumber(ingredient.grams) ?? 0;
                aggregated.set(key, current);
            });
        });
        const panel = planElement("section", "meal-plan-shopping-list");
        panel.append(planElement("h4", "", `Lista zakupów · Dzień ${Number(day.day_index) + 1}`));
        [...aggregated.values()]
            .filter((item) => item.grams > 0)
            .sort((left, right) => left.name.localeCompare(right.name, "pl"))
            .forEach((item) => {
                const row = planElement("div", "meal-plan-shopping-row");
                row.append(planElement("span", "", item.name), planElement("strong", "", formatShoppingQuantity(item.grams)));
                panel.append(row);
            });
        wrapper.append(panel);
        return wrapper;
    }

    function renderMealPlanDay(dayIndex) {
        selectedMealPlanDay = dayIndex;
        document.querySelectorAll("#meal-day-tabs button").forEach((button) => {
            const selected = Number(button.dataset.dayIndex) === dayIndex;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-selected", String(selected));
        });
        const list = document.getElementById("meal-plan-list");
        if (!list) return;
        list.replaceChildren();
        const day = mealPlanDay(dayIndex);
        if (!day) {
            const empty = document.createElement("div");
            empty.className = "meal-plan-empty";
            const heading = document.createElement("h4");
            const copy = document.createElement("p");
            heading.textContent = `Dzień ${dayIndex + 1}`;
            copy.textContent = "Ten dzień nie został jeszcze wygenerowany. Użyje aktywnego planu, ustawionej diety, alergii i profilu bezpieczeństwa.";
            empty.append(heading, copy, mealGenerationButton(dayIndex));
            list.append(empty);
            updateMealGenerationAccess();
            return;
        }
        list.append(renderMealPlanDaySummary(day));
        const meals = (Array.isArray(day.meals) ? day.meals : [])
            .slice()
            .sort((left, right) => Number(left.meal_order) - Number(right.meal_order));
        meals.forEach((meal) => list.append(renderMealPlanMealCard(meal)));
        if (!meals.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Ten dzień nie zawiera posiłków.";
            list.append(empty);
        }
        list.append(renderMealPlanShoppingList(day));
        if (lockedMealPlanIds.size) {
            list.append(planElement("p", "meal-plan-locked-count", `Zachowane posiłki: ${lockedMealPlanIds.size}`));
        }
        const action = document.createElement("div");
        action.className = "meal-plan-regenerate-wrap";
        action.append(mealGenerationButton(dayIndex, true));
        list.append(action);
        updateMealGenerationAccess();
    }

    function renderMealPlan(plan, preferredDay = null, options = {}) {
        const previousPlanId = currentMealPlan?.id || null;
        currentMealPlan = plan && Array.isArray(plan.days) ? plan : null;
        const allMealIds = new Set((currentMealPlan?.days || []).flatMap((day) =>
            (Array.isArray(day.meals) ? day.meals : []).map((meal) => String(meal.id || "")).filter(Boolean)
        ));
        lockedMealPlanIds = new Set([...lockedMealPlanIds].filter((id) => allMealIds.has(id)));
        expandedMealPlanIds = new Set([...expandedMealPlanIds].filter((id) => allMealIds.has(id)));
        if (options.resetUi === true || previousPlanId !== currentMealPlan?.id) {
            lockedMealPlanIds.clear();
            mealPlanShoppingOpen = false;
            expandedMealPlanIds = new Set(allMealIds);
        }
        const tabs = document.getElementById("meal-day-tabs");
        const list = document.getElementById("meal-plan-list");
        if (!tabs || !list) return;
        tabs.replaceChildren();
        for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.dayIndex = String(dayIndex);
            button.setAttribute("role", "tab");
            const generated = Boolean(mealPlanDay(dayIndex));
            button.textContent = `${dayIndex + 1}${generated ? " ✓" : ""}`;
            button.addEventListener("click", () => {
                mealPlanShoppingOpen = false;
                lockedMealPlanIds.clear();
                const selectedDay = mealPlanDay(dayIndex);
                (selectedDay?.meals || []).forEach((meal) => expandedMealPlanIds.add(String(meal.id || "")));
                renderMealPlanDay(dayIndex);
                if (!selectedDay && !mealPlanActionBusy()) void generateMealPlanDay(dayIndex);
            });
            tabs.append(button);
        }
        const firstGeneratedDay = currentMealPlan?.days?.find((day) => Array.isArray(day.meals) && day.meals.length)?.day_index;
        const hasPreferredDay = preferredDay !== null && preferredDay !== undefined;
        const requestedDay = Number(preferredDay);
        const startDay = hasPreferredDay && Number.isInteger(requestedDay) && requestedDay >= 0 && requestedDay <= 6
            ? requestedDay
            : Number.isFinite(Number(firstGeneratedDay)) ? Number(firstGeneratedDay) : 0;
        renderMealPlanDay(startDay);
        if (currentMealPlan) {
            setText("meal-plan-message", `${formatDiet(currentMealPlan.diet_type)} · ${formatNumber(currentMealPlan.calories_target)} kcal · tydzień od ${formatDate(currentMealPlan.week_start)}`);
        } else {
            setText("meal-plan-message", "Wybierz dzień i wygeneruj pierwszy plan DEV.");
        }
    }

    async function refreshMealViews(preferredDay) {
        const [dashboardResult, todayMealsResult, planResult] = await Promise.all([
            client.rpc("get_dashboard_snapshot"),
            client.rpc("get_today_meals"),
            client.rpc("get_current_meal_plan")
        ]);
        if (!dashboardResult.error) renderDashboard(dashboardResult.data);
        if (!todayMealsResult.error) renderTodayMeals(todayMealsResult.data);
        if (planResult.error || !planResult.data) return false;
        renderMealPlan(planResult.data, preferredDay);
        return true;
    }

    async function logMealPlanMealToday(mealId) {
        if (mealPlanActionBusy() || !mealId) return;
        mealPlanLoggingId = mealId;
        setToolStatus("meal-plan-action-status", "Dodaję posiłek do dzisiejszego bilansu DEV…");
        renderMealPlanDay(selectedMealPlanDay);
        const preferredDay = selectedMealPlanDay;
        try {
            const { error } = await client.rpc("log_meal_plan_meal_today", { p_meal_plan_meal_id: mealId });
            if (error) {
                setToolStatus("meal-plan-action-status", friendlyDataError(error), "error");
                return;
            }
            const refreshed = await refreshMealViews(preferredDay);
            setToolStatus(
                "meal-plan-action-status",
                refreshed ? "Posiłek dodano do dzisiejszego bilansu." : "Posiłek zapisano, ale odświeżenie widoku nie powiodło się.",
                refreshed ? "success" : "error"
            );
        } catch {
            setToolStatus("meal-plan-action-status", "Nie udało się dodać posiłku do dzisiejszego bilansu DEV.", "error");
        } finally {
            mealPlanLoggingId = null;
            renderMealPlanDay(selectedMealPlanDay);
        }
    }

    async function swapMealPlanMeal(mealId) {
        if (mealPlanActionBusy() || !mealId) return;
        const requirement = mealSwapRequirement();
        if (requirement) {
            setToolStatus("meal-plan-action-status", requirement, "error");
            return;
        }
        mealPlanSwappingId = mealId;
        const preferredDay = selectedMealPlanDay;
        setToolStatus("meal-plan-action-status", "Przemala dobiera nowy posiłek i sprawdza cały dzień. To może potrwać do 90 sekund…");
        renderMealPlanDay(preferredDay);
        try {
            const { data, error } = await client.functions.invoke("swap-meal", { body: { meal_id: mealId } });
            if (error || data?.error) {
                const code = await edgeFunctionErrorCode(error, data);
                setToolStatus("meal-plan-action-status", featureErrorMessage(code, "zamiany posiłku"), "error");
                return;
            }
            let updatedPlan = data?.plan && Array.isArray(data.plan.days) ? data.plan : null;
            if (!updatedPlan) {
                const readback = await client.rpc("get_current_meal_plan");
                if (!readback.error && readback.data && Array.isArray(readback.data.days)) updatedPlan = readback.data;
            }
            if (!updatedPlan) {
                setToolStatus("meal-plan-action-status", "Posiłek został wysłany do zamiany, ale nie udało się potwierdzić nowego planu.", "error");
                return;
            }
            const premiumResult = await client.rpc("get_premium_snapshot");
            if (!premiumResult.error) {
                currentPremiumSnapshot = premiumResult.data;
                premiumSnapshotUnavailable = false;
            }
            renderMealPlan(updatedPlan, preferredDay);
            setToolStatus("meal-plan-action-status", "Posiłek zamieniono i ponownie sprawdzono cały dzień.", "success");
        } catch {
            setToolStatus("meal-plan-action-status", "Nie udało się połączyć z funkcją zamiany posiłku DEV.", "error");
        } finally {
            mealPlanSwappingId = null;
            renderMealPlanDay(selectedMealPlanDay);
            updateMealGenerationAccess();
        }
    }

    async function generateMealPlanDay(dayIndex) {
        if (mealPlanActionBusy() || !Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) return;
        const requirement = mealPlanGenerationRequirement(dayIndex);
        if (requirement) {
            setToolStatus("meal-plan-action-status", requirement, "error");
            return;
        }
        mealPlanGenerating = true;
        selectedMealPlanDay = dayIndex;
        setToolStatus("meal-plan-action-status", `Przemala układa dzień ${dayIndex + 1}. To może potrwać kilkadziesiąt sekund…`);
        updateMealGenerationAccess();
        try {
            const regenerate = Boolean(mealPlanDay(dayIndex));
            const dayMealIds = new Set((mealPlanDay(dayIndex)?.meals || []).map((meal) => String(meal.id || "")));
            const lockedMealIds = [...lockedMealPlanIds].filter((id) => dayMealIds.has(id));
            const { data, error } = await client.functions.invoke("generate-meal-plan", {
                body: {
                    regenerate,
                    day_index: dayIndex,
                    locked_meal_ids: lockedMealIds,
                    language: "pl"
                }
            });
            if (error || data?.error) {
                const baseCode = await edgeFunctionErrorCode(error, data);
                const code = String(baseCode).toUpperCase() === "NO_VALID_DAY" && data?.reason_code
                    ? data.reason_code
                    : baseCode;
                setToolStatus("meal-plan-action-status", featureErrorMessage(code, "generatora planu"), "error");
                return;
            }
            let generatedPlan = data?.plan && Array.isArray(data.plan.days) ? data.plan : null;
            if (!generatedPlan) {
                const readback = await client.rpc("get_current_meal_plan");
                if (!readback.error && readback.data && Array.isArray(readback.data.days)) generatedPlan = readback.data;
            }
            if (!generatedPlan || !generatedPlan.days.some((day) => Number(day.day_index) === dayIndex)) {
                setToolStatus("meal-plan-action-status", "Dzień został wysłany do generatora, ale nie udało się potwierdzić zapisu. Odśwież stronę.", "error");
                return;
            }
            const premiumResult = await client.rpc("get_premium_snapshot");
            if (!premiumResult.error) {
                currentPremiumSnapshot = premiumResult.data;
                premiumSnapshotUnavailable = false;
            }
            lockedMealPlanIds.clear();
            mealPlanShoppingOpen = false;
            renderMealPlan(generatedPlan, dayIndex);
            const generatedDay = mealPlanDay(dayIndex);
            (generatedDay?.meals || []).forEach((meal) => expandedMealPlanIds.add(String(meal.id || "")));
            renderMealPlanDay(dayIndex);
            setToolStatus("meal-plan-action-status", `Dzień ${dayIndex + 1} jest gotowy i zapisany w DEV.`, "success");
        } catch {
            setToolStatus("meal-plan-action-status", "Nie udało się połączyć z generatorem planu DEV.", "error");
        } finally {
            mealPlanGenerating = false;
            renderMealPlanDay(selectedMealPlanDay);
            updateMealGenerationAccess();
        }
    }

    function renderFoodResults(rows) {
        const target = document.getElementById("food-search-results");
        if (!target) return;
        target.replaceChildren();
        const foods = Array.isArray(rows) ? rows : [];
        if (!foods.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Brak produktów pasujących do wyszukiwania.";
            target.append(empty);
            return;
        }
        foods.forEach((food) => {
            const row = document.createElement("div");
            row.className = "food-result-row";
            const copy = document.createElement("div");
            const name = document.createElement("strong");
            const detail = document.createElement("small");
            const kcal = document.createElement("span");
            name.textContent = food.name || "Produkt";
            detail.textContent = `${food.brand || "Bez marki"} · B ${formatNumber(food.protein_per_100g)} · T ${formatNumber(food.fat_per_100g)} · W ${formatNumber(food.carbs_per_100g)} / 100 g`;
            kcal.textContent = `${formatNumber(food.calories_per_100g)} kcal`;
            copy.append(name, detail);
            row.append(copy, kcal);
            target.append(row);
        });
    }

    async function searchFoods(query) {
        const button = foodSearchForm?.querySelector("button");
        if (button) button.disabled = true;
        setText("food-search-status", "Wyszukiwanie w bazie DEV…");
        const { data, error } = await client.rpc("search_food_catalog", { p_query: query, p_limit: 12 });
        if (button) button.disabled = false;
        if (error) {
            renderFoodResults([]);
            setText("food-search-status", friendlyDataError(error));
            return;
        }
        renderFoodResults(data);
        setText("food-search-status", `Znaleziono: ${formatNumber(data?.length || 0)}.`);
    }

    function renderFridgeProposal(proposal) {
        const result = document.getElementById("fridge-result");
        const ingredients = document.getElementById("fridge-ingredients");
        if (!result || !ingredients) return;
        setText("fridge-result-title", proposal?.title || "Propozycja posiłku");
        setText("fridge-fit", finiteNumber(proposal?.fit_percent) === null ? "—" : `${formatNumber(proposal.fit_percent)}% dopasowania`);
        setText("fridge-fit-note", proposal?.fit_note_pl || "Dopasowano do aktualnego planu DEV.");
        setText("fridge-calories", `${formatNumber(proposal?.totals?.calories)} kcal`);
        setText("fridge-protein", `${formatNumber(proposal?.totals?.protein_g)} g`);
        setText("fridge-fat", `${formatNumber(proposal?.totals?.fat_g)} g`);
        setText("fridge-carbs", `${formatNumber(proposal?.totals?.carbs_g)} g`);
        setText("fridge-instructions", proposal?.instructions_pl || "—");
        ingredients.replaceChildren();
        (Array.isArray(proposal?.ingredients) ? proposal.ingredients : []).forEach((ingredient) => {
            const row = document.createElement("div");
            row.className = "fridge-ingredient";
            const name = document.createElement("strong");
            const amount = document.createElement("span");
            name.textContent = ingredient.name || ingredient.declared_product || "Składnik";
            amount.textContent = `${formatNumber(ingredient.grams)} g`;
            row.append(name, amount);
            ingredients.append(row);
        });
        result.hidden = false;
    }

    async function generateFridgeProposal(products) {
        fridgeGenerateButton.disabled = true;
        fridgeGenerateButton.querySelector("span").textContent = "Układanie…";
        setText("fridge-status", "Lodówka DEV analizuje produkty i aktualny plan…");
        document.getElementById("fridge-status")?.classList.remove("error");
        document.getElementById("fridge-result")?.setAttribute("hidden", "");
        const { data, error } = await client.functions.invoke("fridge-meal", {
            body: {
                action: "generate",
                products,
                avoid_titles: [],
                custom_target: null,
                language: "pl"
            }
        });
        fridgeGenerateButton.disabled = false;
        fridgeGenerateButton.querySelector("span").textContent = "Ułóż posiłek";
        if (error || data?.error || !data?.proposal) {
            const code = await edgeFunctionErrorCode(error, data);
            setText("fridge-status", featureErrorMessage(code, "Lodówki"));
            document.getElementById("fridge-status")?.classList.add("error");
            return;
        }
        renderFridgeProposal(data.proposal);
        setText("fridge-status", "Propozycja została wygenerowana w DEV. Nie zapisano jej w dzienniku.");
    }

    function coachMessageElement(message) {
        const item = document.createElement("article");
        item.className = `coach-message ${message.role === "user" ? "user" : "assistant"}`;
        item.append(document.createTextNode(message.message_text || message.message || ""));
        if (message.created_at) {
            const time = document.createElement("small");
            time.textContent = formatDate(message.created_at, true);
            item.append(time);
        }
        return item;
    }

    function renderCoachMessages(rows) {
        const target = document.getElementById("coach-messages");
        if (!target) return;
        target.replaceChildren();
        const messages = Array.isArray(rows) ? rows : [];
        if (!messages.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Nie ma jeszcze rozmowy. Możesz zadać pierwsze pytanie Coachowi DEV.";
            target.append(empty);
            return;
        }
        messages.forEach((message) => target.append(coachMessageElement(message)));
        target.scrollTop = target.scrollHeight;
    }

    async function loadCoachHistory(user) {
        const sequence = dataLoadSequence;
        const conversationResult = await client.from("ai_conversations")
            .select("id,last_message_at")
            .eq("user_id", user.id)
            .eq("status", "active")
            .order("last_message_at", { ascending: false })
            .limit(1)
            .maybeSingle();
        if (sequence !== dataLoadSequence || user.id !== activeUserId) return;
        if (conversationResult.error) {
            renderCoachMessages([]);
            setText("coach-status", friendlyDataError(conversationResult.error));
            return;
        }
        currentCoachConversationId = conversationResult.data?.id || null;
        if (!currentCoachConversationId) {
            renderCoachMessages([]);
            setText("coach-status", "Gotowy do rozpoczęcia nowej rozmowy DEV.");
            return;
        }
        const messagesResult = await client.from("ai_messages")
            .select("id,role,message_text,created_at")
            .eq("user_id", user.id)
            .eq("conversation_id", currentCoachConversationId)
            .order("created_at", { ascending: false })
            .limit(40);
        if (sequence !== dataLoadSequence || user.id !== activeUserId) return;
        if (messagesResult.error) {
            renderCoachMessages([]);
            setText("coach-status", friendlyDataError(messagesResult.error));
            return;
        }
        renderCoachMessages((messagesResult.data || []).reverse());
        setText("coach-status", "Historia rozmowy pobrana z DEV.");
    }

    async function sendCoachMessage(message) {
        coachSendButton.disabled = true;
        coachInput.disabled = true;
        setText("coach-status", "Coach DEV przygotowuje odpowiedź…");
        const { data, error } = await client.functions.invoke("coach-message", {
            body: { message, conversation_id: currentCoachConversationId }
        });
        coachSendButton.disabled = false;
        coachInput.disabled = false;
        if (error || data?.error || !data?.message) {
            const code = await edgeFunctionErrorCode(error, data);
            setText("coach-status", featureErrorMessage(code, "AI Coacha"));
            coachInput.focus();
            return;
        }
        currentCoachConversationId = data.conversation_id || currentCoachConversationId;
        coachInput.value = "";
        setText("coach-limit", data.coach_remaining === null || data.coach_remaining === undefined
            ? `Pakiet: ${data.premium_tier || "DEV"}`
            : `Pozostało odpowiedzi: ${formatNumber(data.coach_remaining)}`);
        if (data.history_saved) {
            await loadCoachHistory({ id: activeUserId });
        } else {
            const target = document.getElementById("coach-messages");
            target?.querySelector(".empty-history")?.remove();
            target?.append(coachMessageElement({ role: "user", message_text: message }));
            target?.append(coachMessageElement({ role: "assistant", message_text: data.message }));
            if (target) target.scrollTop = target.scrollHeight;
            setText("coach-status", "Odpowiedź odebrana, ale historia nie została zapisana.");
        }
    }

    function challengeOriginLabel(origin) {
        return origin === "przemala" ? "Przemala" : "System";
    }

    function renderChallenges(systemSnapshot, przemalaSnapshot) {
        const target = document.getElementById("challenge-list");
        if (!target) return;
        target.replaceChildren();
        const combined = [
            ...(Array.isArray(systemSnapshot?.active_challenges) ? systemSnapshot.active_challenges : []),
            ...(Array.isArray(przemalaSnapshot?.active_challenges) ? przemalaSnapshot.active_challenges : [])
        ];
        const challenges = [...new Map(combined.map((challenge) => [
            `${challenge.origin || "system"}:${challenge.id || challenge.slug || challenge.title_pl}`,
            challenge
        ])).values()];
        setText("challenges-count", String(challenges.length));
        if (!challenges.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Brak aktywnych wyzwań w DEV.";
            target.append(empty);
            return;
        }

        challenges.forEach((challenge) => {
            const card = document.createElement("article");
            card.className = "challenge-card";
            const heading = document.createElement("div");
            heading.className = "challenge-card-head";
            const copy = document.createElement("div");
            const title = document.createElement("h4");
            title.textContent = challenge.title_pl || "Wyzwanie";
            const description = document.createElement("p");
            description.textContent = challenge.description_pl || "Aktywne wyzwanie Project Weight Drop.";
            copy.append(title, description);
            const points = document.createElement("span");
            points.textContent = `+${formatNumber(challenge.points)} pkt`;
            heading.append(copy, points);

            const progressValue = finiteNumber(challenge.progress) ?? 0;
            const progressTarget = finiteNumber(challenge.target) ?? 0;
            const progressPercent = progressTarget > 0
                ? Math.max(0, Math.min(100, (progressValue / progressTarget) * 100))
                : 0;
            const progress = document.createElement("div");
            progress.className = "challenge-progress";
            progress.setAttribute("role", "progressbar");
            progress.setAttribute("aria-valuemin", "0");
            progress.setAttribute("aria-valuemax", "100");
            progress.setAttribute("aria-valuenow", String(Math.round(progressPercent)));
            const progressFill = document.createElement("i");
            progressFill.style.width = `${progressPercent}%`;
            progress.append(progressFill);

            const meta = document.createElement("small");
            const participation = challenge.joined
                ? `${formatNumber(progressValue)} / ${formatNumber(progressTarget)} dni`
                : "Nie dołączono";
            const dateRange = challenge.starts_at && challenge.ends_at
                ? ` · ${formatDate(challenge.starts_at)}–${formatDate(challenge.ends_at)}`
                : "";
            meta.textContent = `${challengeOriginLabel(challenge.origin)} · ${participation}${dateRange}`;
            card.append(heading, progress, meta);
            target.append(card);
        });
    }

    function renderLeaderboard(systemSnapshot, przemalaSnapshot) {
        const target = document.getElementById("leaderboard-list");
        if (!target) return;
        target.replaceChildren();
        const systemRows = (Array.isArray(systemSnapshot?.leaderboard) ? systemSnapshot.leaderboard : [])
            .map((entry) => ({ ...entry, origin: "system" }));
        const przemalaRows = (Array.isArray(przemalaSnapshot?.leaderboard) ? przemalaSnapshot.leaderboard : [])
            .map((entry) => ({ ...entry, origin: "przemala" }));
        const rows = [...systemRows.slice(0, 10), ...przemalaRows.slice(0, 10)];
        setText("leaderboard-count", String(rows.length));
        if (!rows.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Ranking DEV jest jeszcze pusty.";
            target.append(empty);
            return;
        }

        rows.forEach((entry) => {
            const row = document.createElement("article");
            row.className = `leaderboard-row${entry.is_current_user ? " current" : ""}`;
            const rank = document.createElement("b");
            const originPrefix = entry.origin === "przemala" ? "P" : "S";
            rank.textContent = `${originPrefix}#${formatNumber(entry.rank)}`;
            rank.title = entry.origin === "przemala" ? "Ranking Przemala" : "Ranking systemowy";
            const name = document.createElement("strong");
            name.textContent = entry.display_name || "Użytkownik";
            const points = document.createElement("span");
            points.textContent = `${formatNumber(entry.points)} pkt`;
            row.append(rank, name, points);
            target.append(row);
        });
    }

    function renderCommunityPosts(snapshot) {
        const target = document.getElementById("community-posts");
        if (!target) return;
        target.replaceChildren();
        const posts = Array.isArray(snapshot?.posts) ? snapshot.posts : [];
        setText("posts-count", String(posts.length));
        if (!posts.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = snapshot?.profile
                ? "Nie ma jeszcze postów widocznych dla tego konta DEV."
                : "Najpierw zaakceptuj zasady społeczności w aplikacji Android DEV.";
            target.append(empty);
            return;
        }

        posts.forEach((post) => {
            const item = document.createElement("article");
            item.className = "community-post";
            const heading = document.createElement("div");
            heading.className = "community-post-head";
            const author = document.createElement("strong");
            author.textContent = post.author_name || "Użytkownik";
            const date = document.createElement("time");
            date.dateTime = post.created_at || "";
            date.textContent = formatDate(post.created_at, true);
            heading.append(author, date);
            const caption = document.createElement("p");
            caption.textContent = post.caption || "Post bez opisu.";
            const comments = Array.isArray(post.comments) ? post.comments.length : 0;
            const meta = document.createElement("small");
            meta.textContent = `${comments} ${comments === 1 ? "komentarz" : "komentarzy"}${post.image_path ? " · zawiera zdjęcie" : ""}`;
            item.append(heading, caption, meta);
            target.append(item);
        });
    }

    function renderCommunity(communitySnapshot, systemSnapshot, przemalaSnapshot, hasError) {
        const systemPoints = finiteNumber(systemSnapshot?.total_points) ?? 0;
        const przemalaPoints = finiteNumber(przemalaSnapshot?.total_points) ?? 0;
        setText("community-points", formatNumber(systemPoints + przemalaPoints));
        const ranks = [];
        if (finiteNumber(systemSnapshot?.my_rank) !== null) ranks.push(`S#${formatNumber(systemSnapshot.my_rank)}`);
        if (finiteNumber(przemalaSnapshot?.my_rank) !== null) ranks.push(`P#${formatNumber(przemalaSnapshot.my_rank)}`);
        setText("community-rank", ranks.join(" / ") || "—");
        renderChallenges(systemSnapshot, przemalaSnapshot);
        renderLeaderboard(systemSnapshot, przemalaSnapshot);
        renderCommunityPosts(communitySnapshot);

        const profileReady = Boolean(communitySnapshot?.profile) ||
            Boolean(systemSnapshot?.profile_ready) || Boolean(przemalaSnapshot?.profile_ready);
        if (hasError) {
            setText("community-message", "Część danych społeczności DEV jest chwilowo niedostępna.");
        } else if (!profileReady) {
            setText("community-message", "Aby korzystać ze społeczności, zaakceptuj jej zasady w aplikacji Android DEV.");
        } else {
            setText("community-message", "Prawdziwe dane konta DEV. Publikowanie i udział pozostają na razie w aplikacji Android DEV.");
        }
    }

    async function loadCommunityData(user) {
        const sequence = dataLoadSequence;
        const [communityResult, systemResult, przemalaResult] = await Promise.all([
            client.rpc("get_community_snapshot"),
            client.rpc("get_community_challenges_snapshot_v3", { p_origin: "system" }),
            client.rpc("get_community_challenges_snapshot_v3", { p_origin: "przemala" })
        ]);
        if (sequence !== dataLoadSequence || user.id !== activeUserId) return;
        renderCommunity(
            communityResult.error ? null : communityResult.data,
            systemResult.error ? null : systemResult.data,
            przemalaResult.error ? null : przemalaResult.data,
            Boolean(communityResult.error || systemResult.error || przemalaResult.error)
        );
    }

    async function loadAccountData(user) {
        const sequence = ++dataLoadSequence;
        resetAccountViews();

        const profileColumns = [
            "user_id", "start_weight_kg", "current_weight_kg", "goal_weight_kg", "diet_type",
            "meals_per_day", "activity_level", "strength_training_days", "average_steps",
            "timezone", "goal_type", "onboarding_completed", "sex_for_calculations", "age_years",
            "height_cm", "main_challenge", "energy_adjustment_percent"
        ].join(",");
        const planColumns = "calories_target,protein_g,fat_g,carbs_g,diet_type,status,version";

        const [
            dashboardResult, profileResult, planResult, weeklyResult, weightResult, stepsResult,
            todayMealsResult, mealPlanResult, consentResult, bodyResult, eventResult,
            safetyResult, preferencesResult, preferenceCatalogResult, premiumResult
        ] = await Promise.all([
            client.rpc("get_dashboard_snapshot"),
            client.from("profiles").select(profileColumns).eq("user_id", user.id).maybeSingle(),
            client.from("nutrition_plans").select(planColumns).eq("user_id", user.id)
                .eq("status", "active").order("version", { ascending: false }).limit(1).maybeSingle(),
            client.rpc("get_weekly_progress_report"),
            client.from("weight_logs").select("id,weight_kg,measured_at,source").eq("user_id", user.id)
                .order("measured_at", { ascending: false }).limit(12),
            client.from("daily_summaries").select("summary_date,steps,steps_recorded_at,water_ml,wellbeing_score")
                .eq("user_id", user.id).order("summary_date", { ascending: false }).limit(7),
            client.rpc("get_today_meals"),
            client.rpc("get_current_meal_plan"),
            client.from("user_privacy_consents").select("explicit_health_data_consent,consented_at")
                .eq("user_id", user.id).eq("policy_version", CURRENT_PRIVACY_POLICY_VERSION)
                .eq("explicit_health_data_consent", true).limit(1).maybeSingle(),
            client.from("body_measurements").select("measurement_date,waist_cm,hips_cm,chest_cm,arm_cm,thigh_cm,measured_at")
                .eq("user_id", user.id).order("measurement_date", { ascending: false }).limit(1).maybeSingle(),
            client.from("user_event_goals").select("event_name,event_date,updated_at")
                .eq("user_id", user.id).limit(1).maybeSingle(),
            client.from("safety_profiles").select("pregnant,breastfeeding,eating_disorder_risk,uses_hypoglycemia_medication,uses_sglt2_inhibitor,confirmed_at")
                .eq("user_id", user.id).limit(1).maybeSingle(),
            client.rpc("get_meal_preferences"),
            client.rpc("get_meal_preference_catalog"),
            client.rpc("get_premium_snapshot")
        ]);

        if (sequence !== dataLoadSequence || user.id !== activeUserId) return;

        currentNutritionPlan = planResult.error ? null : planResult.data;
        currentPremiumSnapshot = premiumResult.error ? null : premiumResult.data;
        premiumSnapshotUnavailable = Boolean(premiumResult.error);

        if (profileResult.error) {
            const message = friendlyDataError(profileResult.error);
            profileDataPanel?.setAttribute("aria-busy", "false");
            setText("profile-data-message", message);
            setText("home-profile-status", "Błąd odczytu");
            setText("home-profile-detail", message);
            setStatusCard("profile-status-card", "error");
        } else {
            renderProfile(profileResult.data, planResult.error ? null : planResult.data);
        }

        if (dashboardResult.error) {
            const message = friendlyDataError(dashboardResult.error);
            dashboardOverview?.setAttribute("aria-busy", "false");
            setText("dashboard-message", message);
            setText("home-data-status", "Brak danych");
            setText("home-data-detail", message);
            setStatusCard("dashboard-status-card", "error");
        } else {
            renderDashboard(dashboardResult.data);
        }

        if (weeklyResult.error) {
            document.getElementById("progress-summary")?.setAttribute("aria-busy", "false");
            setText("progress-message", friendlyDataError(weeklyResult.error));
        } else {
            renderWeeklyProgress(weeklyResult.data);
        }

        if (weightResult.error) {
            renderWeightHistory([]);
        } else {
            renderWeightHistory(weightResult.data);
        }
        if (stepsResult.error) {
            renderStepsHistory([]);
        } else {
            renderStepsHistory(stepsResult.data);
        }

        if (todayMealsResult.error) {
            renderTodayMeals([]);
            setText("meals-message", friendlyDataError(todayMealsResult.error));
        } else {
            renderTodayMeals(todayMealsResult.data);
        }
        if (mealPlanResult.error) {
            renderMealPlan(null);
            setText("meal-plan-message", friendlyDataError(mealPlanResult.error));
        } else {
            renderMealPlan(mealPlanResult.data);
        }

        renderHealthConsent(consentResult.error ? null : consentResult.data, consentResult.error);
        renderBodyMeasurement(bodyResult.error ? null : bodyResult.data, bodyResult.error);
        renderEventGoal(eventResult.error ? null : eventResult.data, profileResult.error ? null : profileResult.data, eventResult.error);
        renderSafetyProfile(safetyResult.error ? null : safetyResult.data, safetyResult.error);
        renderMealPreferences(
            preferencesResult.error ? null : preferencesResult.data,
            preferenceCatalogResult.error ? [] : preferenceCatalogResult.data,
            preferencesResult.error || preferenceCatalogResult.error
        );
        const needsProfileSetup = renderProfileSetup(
            profileResult.error ? null : profileResult.data,
            planResult.error ? null : planResult.data,
            profileResult.error,
            planResult.error
        );
        updateMealGenerationAccess();
        healthToolsContent?.setAttribute("aria-busy", "false");
        if (needsProfileSetup) navigateTo("profile");
    }

    function renderUser(user) {
        const name = userDisplayName(user);
        const email = user.email || "Konto DEV";
        const letter = avatarLetter(name);
        setText("welcome-name", name);
        document.getElementById("sidebar-user-name").textContent = name;
        document.getElementById("sidebar-user-email").textContent = email;
        document.getElementById("sidebar-avatar").textContent = letter;
        document.getElementById("profile-avatar").textContent = letter;
        document.getElementById("profile-email").textContent = email;
    }

    function showSignedOut(message = "Połączenie wyłącznie z projektem DEV", kind = "neutral") {
        dataLoadSequence += 1;
        activeUserId = null;
        profileResetBusy = false;
        if (profileResetModal) profileResetModal.hidden = true;
        document.body.classList.remove("modal-open");
        if (profileResetResult) profileResetResult.textContent = "";
        appView.hidden = true;
        authView.hidden = false;
        loginForm.reset();
        setAuthMode("sign-in", { resetStatus: false });
        setAuthBusy(false);
        setAuthStatus(message, kind);
        resetAccountViews();
        window.history.replaceState(null, "", window.location.pathname);
    }

    function showSignedIn(user) {
        if (!user?.id) return;
        const shouldLoadData = activeUserId !== user.id || appView.hidden;
        activeUserId = user.id;
        renderUser(user);
        authView.hidden = true;
        appView.hidden = false;
        navigateTo(window.location.hash.slice(1) || "home", false);
        if (shouldLoadData) {
            void loadAccountData(user);
            void loadCoachHistory(user);
            void loadCommunityData(user);
        }
    }

    async function verifyCurrentUser() {
        const { data, error } = await client.auth.getUser();
        if (error || !data.user) {
            showSignedOut("Sesja wygasła. Zaloguj się ponownie.", "error");
            return null;
        }
        showSignedIn(data.user);
        return data.user;
    }

    function navigateTo(route, updateHash = true) {
        const safeRoute = Object.hasOwn(routeLabels, route) ? route : "home";
        appShell?.classList.toggle("home-route-active", safeRoute === "home");
        document.querySelectorAll(".route-page").forEach((page) => {
            page.classList.toggle("active", page.dataset.page === safeRoute);
        });
        document.querySelectorAll(".nav-item").forEach((item) => {
            const selected = item.dataset.route === safeRoute;
            item.classList.toggle("active", selected);
            if (selected) item.setAttribute("aria-current", "page");
            else item.removeAttribute("aria-current");
        });
        routeTitle.textContent = routeLabels[safeRoute];
        document.title = `${routeLabels[safeRoute]} — Project Weight Drop DEV`;
        if (updateHash) window.history.replaceState(null, "", `#${safeRoute}`);
        document.querySelector(".app-workspace")?.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function signOut() {
        const signOutButtons = [...document.querySelectorAll("[data-sign-out]")];
        signOutButtons.forEach((button) => {
            button.disabled = true;
            const label = button.querySelector("span");
            if (label) label.textContent = "Wylogowywanie…";
        });
        const { error } = await client.auth.signOut({ scope: "local" });
        signOutButtons.forEach((button) => {
            button.disabled = false;
            const label = button.querySelector("span");
            if (label) label.textContent = "Wyloguj";
        });
        if (error) {
            window.alert("Nie udało się wylogować. Spróbuj ponownie.");
            return;
        }
        showSignedOut("Wylogowano. Połączenie wyłącznie z projektem DEV", "success");
    }

    async function initializeAuth() {
        if (!validConfiguration()) {
            configurationAlert.hidden = false;
            configurationAlert.textContent = "Konfiguracja została zatrzymana: dozwolony jest wyłącznie projekt Supabase DEV.";
            loginForm.hidden = true;
            setAuthStatus("Błąd konfiguracji DEV", "error");
            return;
        }
        if (!window.supabase?.createClient) {
            configurationAlert.hidden = false;
            configurationAlert.textContent = "Nie udało się załadować bezpiecznego modułu logowania. Odśwież stronę.";
            loginForm.hidden = true;
            setAuthStatus("Moduł logowania niedostępny", "error");
            return;
        }

        client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: false,
                storageKey: "project-weight-drop-web-dev-auth"
            }
        });

        client.auth.onAuthStateChange((event, session) => {
            window.setTimeout(() => {
                if (event === "SIGNED_OUT" || !session) {
                    if (activeUserId) showSignedOut();
                    return;
                }
                if (session.user?.id !== activeUserId) void verifyCurrentUser();
            }, 0);
        });

        setAuthStatus("Sprawdzanie bezpiecznej sesji DEV…");
        const { data, error } = await client.auth.getSession();
        if (error || !data.session) {
            showSignedOut();
            return;
        }
        await verifyCurrentUser();
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!client) return;
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        if (!email || password.length < 8 || !emailInput.validity.valid) {
            setAuthStatus("Podaj poprawny e-mail i hasło mające co najmniej 8 znaków.", "error");
            return;
        }

        if (authMode === "sign-up") {
            const displayName = normalizeDisplayName(displayNameInput.value);
            if (!validDisplayName(displayName)) {
                setAuthStatus("Nazwa użytkownika musi mieć od 2 do 30 znaków i zawierać literę lub cyfrę.", "error");
                displayNameInput.focus();
                return;
            }
            if (password !== passwordConfirmInput.value) {
                setAuthStatus("Podane hasła nie są takie same.", "error");
                passwordConfirmInput.focus();
                return;
            }

            setAuthBusy(true);
            setAuthStatus("Tworzenie konta w projekcie DEV…");
            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: { display_name: displayName },
                    emailRedirectTo: "https://projectweightdrop.com/email-confirmed.html"
                }
            });
            if (error) {
                setAuthBusy(false);
                setAuthStatus(friendlyAuthError(error, "sign-up"), "error");
                return;
            }
            if (data.session) {
                const user = await verifyCurrentUser();
                if (!user) setAuthBusy(false);
                return;
            }

            passwordInput.value = "";
            passwordConfirmInput.value = "";
            setAuthBusy(false);
            setAuthStatus("Sprawdź e-mail (również Spam) i potwierdź adres. Jeśli konto już istnieje, przejdź do logowania.", "success");
            return;
        }

        setAuthBusy(true);
        setAuthStatus("Bezpieczne logowanie do projektu DEV…");
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) {
            setAuthBusy(false);
            setAuthStatus(friendlyAuthError(error, "sign-in"), "error");
            passwordInput.focus();
            passwordInput.select();
            return;
        }
        const user = await verifyCurrentUser();
        if (!user) setAuthBusy(false);
    });

    authModeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setAuthMode(button.dataset.authMode);
            if (authMode === "sign-up") displayNameInput.focus();
            else emailInput.focus();
        });
    });

    passwordToggle.addEventListener("click", () => {
        const showing = passwordInput.type === "text";
        passwordInput.type = showing ? "password" : "text";
        passwordToggle.textContent = showing ? "Pokaż" : "Ukryj";
        passwordToggle.setAttribute("aria-label", showing ? "Pokaż hasło" : "Ukryj hasło");
        passwordInput.focus();
    });

    foodSearchForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = foodSearchInput?.value.trim() || "";
        if (!client || !activeUserId) {
            setText("food-search-status", "Zaloguj się ponownie, aby przeszukać bazę DEV.");
            return;
        }
        if (query.length < 2) {
            setText("food-search-status", "Wpisz co najmniej 2 znaki.");
            foodSearchInput?.focus();
            return;
        }
        void searchFoods(query);
    });

    fridgeForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const products = fridgeProducts?.value.trim() || "";
        if (!client || !activeUserId) {
            setText("fridge-status", "Zaloguj się ponownie, aby użyć Lodówki DEV.");
            document.getElementById("fridge-status")?.classList.add("error");
            return;
        }
        if (products.length < 3 || products.length > 2000) {
            setText("fridge-status", "Podaj produkty i ilości (od 3 do 2000 znaków).");
            document.getElementById("fridge-status")?.classList.add("error");
            fridgeProducts?.focus();
            return;
        }
        void generateFridgeProposal(products);
    });

    coachForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = coachInput?.value.trim() || "";
        if (!client || !activeUserId) {
            setText("coach-status", "Zaloguj się ponownie, aby użyć AI Coacha DEV.");
            return;
        }
        if (!message || message.length > 2000) {
            setText("coach-status", "Wiadomość musi mieć od 1 do 2000 znaków.");
            coachInput?.focus();
            return;
        }
        void sendCoachMessage(message);
    });

    healthConsentCheckbox?.addEventListener("change", () => {
        healthConsentButton.disabled = !healthConsentCheckbox.checked;
        setToolStatus("health-consent-status", "");
    });
    healthConsentButton?.addEventListener("click", () => void recordHealthConsent());

    document.querySelectorAll("[data-home-tool]").forEach((button) => {
        button.addEventListener("click", () => openHomeTool(button.dataset.homeTool));
    });
    document.querySelectorAll("[data-home-tool-open]").forEach((button) => {
        button.addEventListener("click", () => {
            const tool = button.dataset.homeToolOpen;
            setHomeTool(tool);
            document.getElementById(`home-${tool}-panel`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    });
    homeRefreshButton?.addEventListener("click", () => void refreshAccountData());
    openWeightEntryButton?.addEventListener("click", openWeightEntry);
    cancelWeightEntryButton?.addEventListener("click", closeWeightEntry);
    weightEntryForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        void saveWeightEntry();
    });
    weightEntryModal?.addEventListener("click", (event) => {
        if (event.target === weightEntryModal) closeWeightEntry();
    });

    document.querySelectorAll("[data-water-amount]").forEach((button) => {
        button.addEventListener("click", () => {
            if (!waterAmountInput) return;
            waterAmountInput.value = button.dataset.waterAmount || "";
            waterAmountInput.focus();
        });
    });
    waterForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const rawAmount = waterAmountInput?.value.trim() || "";
        if (!rawAmount) {
            setToolStatus("water-form-status", "Wpisz ilość wody.", "error");
            return;
        }
        void saveWater(Number(rawAmount));
    });
    stepsForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const rawSteps = stepsAmountInput?.value.trim() || "";
        if (!rawSteps) {
            setToolStatus("steps-form-status", "Wpisz dzisiejszą liczbę kroków.", "error");
            return;
        }
        void saveSteps(Number(rawSteps));
    });
    measurementsForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        void saveMeasurements();
    });
    eventForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        void saveEventGoal();
    });
    [document.getElementById("event-date"), eventCurrentWeightInput, eventGoalWeightInput].filter(Boolean).forEach((input) => {
        input.addEventListener("input", () => {
            renderEventProjection();
            setToolStatus("event-form-status", "");
        });
    });
    eventDeleteButton?.addEventListener("click", () => void deleteEventGoal());
    safetyForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        void saveSafetyProfile();
    });
    preferencesForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        void saveMealPreferences();
    });
    profileSetupGoalType?.addEventListener("change", () => {
        syncProfileSetupGoal();
        setToolStatus("profile-setup-status", "");
    });
    profileSetupForm?.addEventListener("input", () => setToolStatus("profile-setup-status", ""));
    profileSetupForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        void submitInitialProfile();
    });

    document.querySelectorAll("[data-coach-prompt]").forEach((button) => {
        button.addEventListener("click", () => {
            if (!coachInput) return;
            coachInput.value = button.dataset.coachPrompt || "";
            coachInput.focus();
        });
    });

    document.querySelectorAll("[data-route]").forEach((button) => {
        button.addEventListener("click", () => navigateTo(button.dataset.route));
    });
    document.querySelectorAll("[data-route-link]").forEach((button) => {
        button.addEventListener("click", () => navigateTo(button.dataset.routeLink));
    });
    document.querySelectorAll("[data-sign-out]").forEach((button) => {
        button.addEventListener("click", () => void signOut());
    });
    openProfileResetButton?.addEventListener("click", openProfileReset);
    cancelProfileResetButton?.addEventListener("click", closeProfileReset);
    confirmProfileResetButton?.addEventListener("click", () => void resetOwnProfile());
    profileResetConfirmation?.addEventListener("input", () => {
        profileResetConfirmation.value = profileResetConfirmation.value.toLocaleUpperCase("pl-PL");
        setProfileResetStatus();
        setProfileResetBusy(false);
    });
    profileResetModal?.addEventListener("click", (event) => {
        if (event.target === profileResetModal) closeProfileReset();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !weightEntryModal?.hidden) {
            closeWeightEntry();
            return;
        }
        if (event.key === "Escape" && !profileResetModal?.hidden) closeProfileReset();
    });
    window.addEventListener("hashchange", () => {
        if (!appView.hidden) navigateTo(window.location.hash.slice(1), false);
    });

    renderHomeDate();
    setHomeTool(null);
    void initializeAuth();
})();
