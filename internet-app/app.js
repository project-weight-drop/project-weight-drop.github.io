(() => {
    "use strict";

    const REQUIRED_PROJECT_REF = "iqqiizsehdjwenqowsqc";
    const CURRENT_PRIVACY_POLICY_VERSION = "2026-08-26";
    const COMMUNITY_RULES_VERSION = "2026-09-09";
    const WEB_APP_VERSION = "web-dev-2026.10.05-progress-community-parity";
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
    const fridgeEmptyState = document.getElementById("fridge-empty-state");
    const fridgeResetButton = document.getElementById("fridge-reset-button");
    const fridgeQuota = document.getElementById("fridge-quota");
    const fridgeCustomCalories = document.getElementById("fridge-custom-calories");
    const fridgeCustomPanel = document.getElementById("fridge-custom-panel");
    const fridgeAddTodayButton = document.getElementById("fridge-add-today-button");
    const fridgeRegenerateButton = document.getElementById("fridge-regenerate-button");
    const fridgeChangeProductsButton = document.getElementById("fridge-change-products-button");
    const fridgeReportButton = document.getElementById("fridge-report-button");
    const coachForm = document.getElementById("coach-form");
    const coachInput = document.getElementById("coach-input");
    const coachSendButton = document.getElementById("coach-send-button");
    const coachHistoryButton = document.getElementById("coach-history-button");
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
    const progressHealthConsentPanel = document.getElementById("progress-health-consent");
    const progressHealthConsentCheckbox = document.getElementById("progress-health-consent-checkbox");
    const progressHealthConsentButton = document.getElementById("progress-health-consent-button");
    const progressDetailView = document.getElementById("progress-detail-view");
    const progressDetailEntryForm = document.getElementById("progress-detail-entry-form");
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
    const mealGramsModal = document.getElementById("meal-grams-modal");
    const mealGramsForm = document.getElementById("meal-grams-form");
    const mealGramsValue = document.getElementById("meal-grams-value");
    const cancelMealGramsButton = document.getElementById("cancel-meal-grams");
    const saveMealDraftButton = document.getElementById("save-meal-draft");
    const closeFoodDayButton = document.getElementById("close-food-day");

    const routeLabels = Object.freeze({
        home: "Home",
        meals: "Posiłki",
        fridge: "Lodówka",
        coach: "AI Coach",
        progress: "Postępy",
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
    let currentWeeklyProgressReport = null;
    let activeProgressSection = "hub";
    let activeProgressDestination = null;
    let currentProgressData = { profile: null, daily: [], weights: [], measurements: [], event: null };
    let currentCommunitySnapshots = { community: null, system: null, przemala: null };
    let challengeDaySelection = new Map();
    let currentCoachMemories = [];
    let coachMemorySavingId = null;
    let weightEntryBusy = false;
    let weightEntryPreviousFocus = null;
    let activeMealsView = "plan";
    let selectedManualMealType = "breakfast";
    let mealDraftItems = [];
    let selectedFoodForGrams = null;
    let mealDraftBusy = false;
    let mealGramsPreviousFocus = null;
    let currentTodayMeals = [];
    let activeFridgeMode = "remaining";
    let currentFridgeProposal = null;
    let currentFridgeProducts = "";
    let fridgeActionBusy = false;
    let fridgeReportBusy = false;

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
        updateFridgeQuota();
        currentNutritionPlan = null;
        mealPlanGenerating = false;
        mealPlanSwappingId = null;
        mealPlanLoggingId = null;
        mealPlanShoppingOpen = false;
        expandedMealPlanIds = new Set();
        lockedMealPlanIds = new Set();
        profileSetupBusy = false;
        currentDashboardSnapshot = null;
        currentWeeklyProgressReport = null;
        currentCoachMemories = [];
        coachMemorySavingId = null;
        weightEntryBusy = false;
        activeMealsView = "plan";
        selectedManualMealType = "breakfast";
        mealDraftItems = [];
        selectedFoodForGrams = null;
        mealDraftBusy = false;
        currentTodayMeals = [];
        if (weightEntryModal) weightEntryModal.hidden = true;
        if (mealGramsModal) mealGramsModal.hidden = true;
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
            "meals-today-consumed", "meals-today-target", "meals-today-protein", "meals-today-fat", "meals-today-carbs",
            "home-weight-progress", "home-weight-detail", "home-next-milestone",
            "home-start-weight", "home-average-weight", "home-weight-change", "profile-onboarding", "profile-diet",
            "profile-goal", "profile-meals", "profile-start-weight", "profile-current-weight",
            "profile-goal-weight", "profile-activity", "profile-strength", "profile-average-steps",
            "profile-timezone", "profile-plan-status", "progress-data-days", "progress-meals",
            "progress-calories", "progress-steps", "progress-water", "progress-weight-change",
            "weight-history-count", "steps-history-count", "measurement-history-count",
            "progress-hub-weight", "progress-hub-water", "progress-hub-steps", "progress-hub-body",
            "progress-hub-macros", "progress-hub-report", "progress-hub-event",
            "progress-macro-calories", "progress-macro-protein", "progress-macro-fat", "progress-macro-carbs",
            "profile-plan-calories", "profile-plan-protein", "profile-plan-fat", "profile-plan-carbs",
            "profile-plan-tdee", "profile-plan-rmr", "profile-today-steps",
            "progress-report-weight", "progress-report-weight-meta", "progress-report-meals",
            "progress-report-meals-meta", "progress-report-hydration", "progress-report-hydration-meta",
            "progress-report-steps", "progress-report-steps-meta", "progress-report-wellbeing",
            "progress-report-wellbeing-meta", "progress-report-calories-adherence",
            "progress-report-protein-adherence", "progress-report-fat-adherence", "progress-report-carbs-adherence"
        ].forEach((id) => setText(id, "—"));
        document.getElementById("progress-weekly-update")?.setAttribute("hidden", "");
        document.getElementById("profile-admin-badge")?.setAttribute("hidden", "");
        document.getElementById("profile-access-link")?.removeAttribute("hidden");
        setText("profile-access-heading", "Project Weight Drop FREE");
        setText("profile-access-detail", "Sprawdzanie pakietu DEV…");
        setText("profile-memory-status", "Sprawdzanie dostępu DEV…");
        document.getElementById("profile-memory-list")?.replaceChildren();
        const progressNotice = document.getElementById("progress-action-notice");
        if (progressNotice) { progressNotice.hidden = true; progressNotice.textContent = ""; }
        [
            "home-calories-bar", "home-protein-bar", "home-fat-bar", "home-carbs-bar",
            "meals-today-calorie-bar", "meals-today-protein-bar", "meals-today-fat-bar", "meals-today-carbs-bar",
            "home-weight-progress-bar", "fridge-target-bar"
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
        setText("today-meals-count", "—");
        setText("meal-plan-generated-count", "0 z 7");
        setText("meal-plan-message", "Pobieranie aktywnego planu DEV…");
        setText("meal-plan-access-title", "Sprawdzanie dostępu…");
        setText("meal-plan-access-copy", "Plan korzysta z aktywnej diety, kalorii, makro i zabezpieczeń konta DEV.");
        setText("meal-plan-quota", "—");
        setToolStatus("meal-plan-action-status", "");
        setText("food-search-status", "Wpisz co najmniej 2 znaki.");
        setMealsView("plan");
        renderMealDraft();
        if (fridgeProducts) fridgeProducts.value = "";
        if (fridgeCustomCalories) fridgeCustomCalories.value = "";
        currentFridgeProposal = null;
        currentFridgeProducts = "";
        setFridgeMode("remaining", { focus: false });
        document.getElementById("fridge-result")?.setAttribute("hidden", "");
        setText("fridge-target-remaining", "—");
        setText("fridge-target-total", "—");
        setText("fridge-target-label", "Pozostało dziś");
        setText("fridge-assistant-copy", "Napisz, jakie produkty masz pod ręką. Dobiorę z nich najbliższy posiłek do Twojego dzisiejszego celu.");
        if (fridgeEmptyState) fridgeEmptyState.hidden = false;
        setFridgeStatus("Gotowe do wygenerowania.");
        updateFridgeQuota();
        if (coachInput) coachInput.value = "";
        const coachMessages = document.getElementById("coach-messages");
        if (coachMessages) coachMessages.innerHTML = '<p class="empty-history">Pobieranie…</p>';
        setText("coach-status", "Pobieranie historii DEV…");
        setText("coach-limit", "Limit sprawdzany przy wysłaniu");
        setText("coach-access-badge", "PRO");
        setText("coach-context-calories", "Pozostało — kcal");
        setText("coach-context-macros", "B — g · T — g · W — g");
        ["community-points", "community-rank", "leaderboard-count", "posts-count", "system-challenge-points", "system-challenge-rank", "przemala-challenge-points", "przemala-challenge-rank"]
            .forEach((id) => setText(id, "—"));
        setText("community-message", "Pobieranie danych DEV…");
        ["system-challenge-list", "system-leaderboard-list", "system-achievements-list", "przemala-challenge-list", "przemala-leaderboard-list", "przemala-achievements-list", "leaderboard-list", "community-posts"]
            .forEach((id) => {
                const list = document.getElementById(id);
                if (list) list.innerHTML = '<p class="empty-history">Pobieranie…</p>';
            });
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
        if (progressHealthConsentCheckbox) progressHealthConsentCheckbox.checked = false;
        if (progressHealthConsentButton) progressHealthConsentButton.disabled = true;
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
            if (statusId.startsWith("progress-")) {
                if (progressHealthConsentPanel) progressHealthConsentPanel.hidden = false;
                progressHealthConsentPanel?.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                healthConsentPanel?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
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
        if (message.includes("invalid_community_display_name")) return "Pseudonim musi mieć od 2 do 30 znaków i nie może zawierać nowych linii.";
        if (message.includes("community_rules_version_required")) return "Zasady Społeczności uległy zmianie. Odśwież stronę i zaakceptuj aktualną wersję.";
        if (message.includes("community_rules_required")) return "Najpierw zaakceptuj zasady i ustaw pseudonim w zakładce Społeczność.";
        if (message.includes("profile_required")) return "Najpierw dokończ profil i konfigurację startową.";
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
        if (progressHealthConsentPanel) progressHealthConsentPanel.hidden = healthConsentGranted;
        if (progressHealthConsentCheckbox) progressHealthConsentCheckbox.checked = false;
        if (progressHealthConsentButton) progressHealthConsentButton.disabled = true;
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

    async function recordHealthConsent(checkbox = healthConsentCheckbox, button = healthConsentButton, statusId = "health-consent-status") {
        if (!client || !activeUserId || !checkbox?.checked || !button) return;
        button.disabled = true;
        button.textContent = "Zapisywanie…";
        setToolStatus(statusId, "Zapisywanie zgody w DEV…");
        const { data, error } = await client.rpc("record_explicit_health_data_consent", {
            p_policy_version: CURRENT_PRIVACY_POLICY_VERSION,
            p_app_version: WEB_APP_VERSION,
            p_locale: "pl-PL"
        });
        button.textContent = "Zapisz zgodę";
        if (error || data?.recorded !== true) {
            button.disabled = false;
            setToolStatus(statusId, healthWriteError(error, "Nie udało się zapisać zgody DEV."), "error");
            return;
        }
        healthConsentGranted = true;
        if (healthConsentPanel) healthConsentPanel.hidden = true;
        if (progressHealthConsentPanel) progressHealthConsentPanel.hidden = true;
        if (profileSetupConsent) {
            profileSetupConsent.checked = true;
            profileSetupConsent.disabled = true;
        }
        updateHealthToolsAvailability();
        setToolStatus(statusId, "Zgoda została zapisana. Możesz uzupełniać dane.", "success");
        if (statusId === "progress-health-consent-status") {
            setToolStatus("progress-detail-status", "Zgoda zapisana. Możesz teraz zapisać wpis w Postępach.", "success");
        }
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

    function remainingValue(consumed, target) {
        const targetValue = finiteNumber(target);
        const consumedValue = finiteNumber(consumed) ?? 0;
        return targetValue === null ? null : Math.max(0, targetValue - consumedValue);
    }

    function setFridgeStatus(message, error = false) {
        const status = document.getElementById("fridge-status");
        if (!status) return;
        status.textContent = message || "";
        status.classList.toggle("error", error);
        status.hidden = !message || message === "Gotowe do wygenerowania.";
    }

    function updateFridgeQuota() {
        if (!fridgeQuota) return;
        const premium = currentPremiumSnapshot;
        if (premium?.admin_granted) {
            fridgeQuota.textContent = "Lodówka dzisiaj: bez limitu";
            fridgeQuota.hidden = false;
            return;
        }
        const limit = finiteNumber(premium?.fridge_generation_limit);
        if (limit !== null) {
            fridgeQuota.textContent = `Lodówka dzisiaj: ${formatNumber(premium?.fridge_generation_remaining ?? 0)}/${formatNumber(limit)}`;
            fridgeQuota.hidden = false;
            return;
        }
        fridgeQuota.textContent = "";
        fridgeQuota.hidden = true;
    }

    function setFridgeMode(mode, { focus = true } = {}) {
        activeFridgeMode = mode === "custom" ? "custom" : "remaining";
        document.querySelectorAll("[data-fridge-mode]").forEach((button) => {
            const selected = button.dataset.fridgeMode === activeFridgeMode;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-selected", String(selected));
        });
        if (fridgeCustomPanel) fridgeCustomPanel.hidden = activeFridgeMode !== "custom";
        setText("fridge-target-label", activeFridgeMode === "custom" ? "Własne kcal" : "Pozostało dziś");
        setText("fridge-assistant-copy", activeFridgeMode === "custom"
            ? "Dobiorę posiłek z Twoich produktów pod wskazaną kaloryczność."
            : "Napisz, jakie produkty masz pod ręką. Dobiorę z nich najbliższy posiłek do Twojego dzisiejszego celu.");
        updateFridgeTargetCard();
        if (focus && activeFridgeMode === "custom") fridgeCustomCalories?.focus();
    }

    function updateFridgeTargetCard() {
        const caloriesTarget = finiteNumber(currentDashboardSnapshot?.calories_target);
        const caloriesConsumed = finiteNumber(currentDashboardSnapshot?.calories_consumed) ?? 0;
        const remaining = remainingValue(caloriesConsumed, caloriesTarget);
        const customCalories = finiteNumber(fridgeCustomCalories?.value);
        if (activeFridgeMode === "custom") {
            setText("fridge-target-remaining", customCalories === null ? "—" : formatNumber(customCalories));
            setText("fridge-target-total", customCalories === null ? "—" : formatNumber(customCalories));
            setProgress("fridge-target-bar", customCalories === null ? 0 : customCalories, customCalories || 100);
            return;
        }
        setText("fridge-target-remaining", formatNumber(remaining));
        setText("fridge-target-total", formatNumber(caloriesTarget));
        setProgress("fridge-target-bar", caloriesConsumed, caloriesTarget);
    }

    function coachAccessBadge(premium) {
        if (!premium) return "PRO";
        if (premium.admin_granted) return "ADMIN ∞";
        const remaining = premium.coach_remaining;
        const limit = premium.coach_limit;
        if (premium.coach_trial_active) return `TEST ${formatNumber(remaining ?? 8)} / ${formatNumber(limit ?? 8)}`;
        if (premium.is_pro) return `PRO ${formatNumber(remaining ?? 8)} / ${formatNumber(limit ?? 8)}`;
        return "PRO";
    }

    function updateCoachContextCard() {
        const remainingCalories = remainingValue(currentDashboardSnapshot?.calories_consumed, currentDashboardSnapshot?.calories_target);
        const proteinRemaining = remainingValue(currentDashboardSnapshot?.protein_consumed, currentDashboardSnapshot?.protein_target);
        const fatRemaining = remainingValue(currentDashboardSnapshot?.fat_consumed, currentDashboardSnapshot?.fat_target);
        const carbsRemaining = remainingValue(currentDashboardSnapshot?.carbs_consumed, currentDashboardSnapshot?.carbs_target);
        setText("coach-context-calories", `Pozostało ${formatNumber(remainingCalories)} kcal`);
        setText("coach-context-macros", `B ${formatNumber(proteinRemaining)} g · T ${formatNumber(fatRemaining)} g · W ${formatNumber(carbsRemaining)} g`);
        setText("coach-access-badge", coachAccessBadge(currentPremiumSnapshot));
        setText("coach-limit", premiumSnapshotUnavailable
            ? "Limit chwilowo niedostępny"
            : currentPremiumSnapshot?.coach_remaining === null || currentPremiumSnapshot?.coach_remaining === undefined
            ? `Pakiet: ${currentPremiumSnapshot?.is_pro || currentPremiumSnapshot?.admin_granted ? "PRO" : "DEV"}`
            : `Pozostało odpowiedzi: ${formatNumber(currentPremiumSnapshot.coach_remaining)}`);
        const allowed = !currentPremiumSnapshot || currentPremiumSnapshot.coach_allowed !== false;
        document.querySelectorAll("[data-coach-prompt]").forEach((button) => { button.disabled = !allowed; });
        if (coachInput && document.activeElement !== coachInput) {
            coachInput.placeholder = allowed ? "Napisz wiadomość…" : "AI Coach wymaga PRO";
        }
        if (coachSendButton) coachSendButton.disabled = !allowed;
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
        setText("meals-today-consumed", formatNumber(caloriesConsumed));
        setText("meals-today-target", formatNumber(caloriesTarget));
        setProgress("meals-today-calorie-bar", caloriesConsumed, caloriesTarget);

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
            setText(`meals-today-${name}`, `${formatMacro(consumed)} / ${formatMacro(target)} g`);
            const consumedValue = finiteNumber(consumed);
            const targetValue = finiteNumber(target);
            const percent = consumedValue === null || targetValue === null || targetValue <= 0
                ? null
                : Math.round((consumedValue / targetValue) * 100);
            setText(`home-${name}-percent`, percent === null ? "—" : `${percent}%`);
            setProgress(`home-${name}-bar`, consumed, target);
            setProgress(`meals-today-${name}-bar`, consumed, target);
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
        updateFridgeTargetCard();
        updateFridgeQuota();
        updateCoachContextCard();
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
        const profileHeader = document.querySelector(".profile-card");
        if (profileHeader && profileHeader.nextElementSibling !== profileSetupPanel) profileHeader.after(profileSetupPanel);

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

    function renderProfileAccess(premium, dashboard, plan) {
        const admin = premium?.admin_granted === true;
        const isPro = premium?.is_pro === true || admin;
        const trialActive = premium?.coach_trial_active === true;
        const heading = document.getElementById("profile-access-heading");
        const detail = document.getElementById("profile-access-detail");
        if (heading) {
            heading.textContent = premiumSnapshotUnavailable
                ? "Status pakietu niedostępny"
                : trialActive
                    ? "Pełny dostęp próbny"
                    : isPro
                        ? admin ? "Dostęp administratora" : "Project Weight Drop PRO"
                        : "Project Weight Drop FREE";
        }
        if (detail) {
            detail.textContent = premiumSnapshotUnavailable
                ? "Nie udało się sprawdzić dostępu w DEV. Odśwież dane."
                : trialActive
                    ? "Wszystkie funkcje są tymczasowo odblokowane."
                    : isPro
                        ? "Pełny pakiet PRO jest aktywny na tym koncie DEV."
                        : "Woda, kroki, Progress i Czat z Przemalą są dostępne bez PRO. Zakup PRO odbywa się w Google Play na Androidzie.";
        }
        const adminBadge = document.getElementById("profile-admin-badge");
        if (adminBadge) adminBadge.hidden = !admin;
        const accessLink = document.getElementById("profile-access-link");
        if (accessLink) accessLink.hidden = isPro || premiumSnapshotUnavailable;

        setText("profile-plan-calories", plan ? formatNumber(plan.calories_target) : "—");
        setText("profile-plan-protein", plan ? `${formatNumber(plan.protein_g)} g` : "—");
        setText("profile-plan-fat", plan ? `${formatNumber(plan.fat_g)} g` : "—");
        setText("profile-plan-carbs", plan ? `${formatNumber(plan.carbs_g)} g` : "—");
        setText("profile-plan-tdee", formatNumber(plan?.estimated_tdee));
        setText("profile-plan-rmr", formatNumber(plan?.estimated_rmr));
        setText("profile-today-steps", formatNumber(dashboard?.steps));
    }

    function renderCoachMemories(memories, message = "") {
        const list = document.getElementById("profile-memory-list");
        if (!list) return;
        list.replaceChildren();
        setText("profile-memory-status", message || "Pamięć Coacha DEV");
        if (!Array.isArray(memories) || memories.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = message.startsWith("Pobieranie") || message.includes("Android") ||
                message.includes("niedostęp") || message.startsWith("Nie udało")
                ? message
                : "Brak aktywnych pamięci. Pojedyncza obserwacja nie jest traktowana jako stała cecha.";
            list.append(empty);
            return;
        }

        memories.forEach((memory) => {
            const row = document.createElement("article");
            row.className = "profile-memory-row";
            const copy = document.createElement("div");
            const title = document.createElement("strong");
            title.textContent = memory.display_text || memory.memory_key || "Obserwacja Coacha";
            const meta = document.createElement("small");
            const confidence = finiteNumber(memory.confidence);
            const confidenceLabel = confidence === null ? "—" : `${Math.round(confidence * 100)}%`;
            const statusLabel = memory.status === "confirmed" ? "Potwierdzone" : "Do potwierdzenia";
            meta.textContent = `${statusLabel} · ${formatNumber(memory.evidence_count)} obserwacje · pewność ${confidenceLabel}`;
            copy.append(title, meta);
            const actions = document.createElement("div");
            actions.className = "profile-memory-actions";
            if (memory.status === "candidate") {
                const confirm = document.createElement("button");
                confirm.type = "button";
                confirm.textContent = "Potwierdź";
                confirm.dataset.memoryAction = "confirm";
                confirm.dataset.memoryId = memory.id;
                confirm.disabled = coachMemorySavingId === memory.id;
                actions.append(confirm);
            }
            const reject = document.createElement("button");
            reject.type = "button";
            reject.textContent = "Usuń";
            reject.dataset.memoryAction = "reject";
            reject.dataset.memoryId = memory.id;
            reject.disabled = coachMemorySavingId === memory.id;
            actions.append(reject);
            row.append(copy, actions);
            list.append(row);
        });
    }

    async function loadProfileCoachMemories(userId, sequence) {
        if (!client || !userId || sequence !== dataLoadSequence || userId !== activeUserId) return;
        renderCoachMemories([], "Pobieranie pamięci Coacha DEV…");
        const { data, error } = await client.from("coach_memory")
            .select("id,memory_type,memory_key,display_text,confidence,status,evidence_count,user_confirmed,first_observed_at,last_observed_at,created_at")
            .eq("user_id", userId)
            .neq("status", "rejected")
            .order("status", { ascending: true })
            .order("confidence", { ascending: false });
        if (sequence !== dataLoadSequence || userId !== activeUserId) return;
        if (error) {
            currentCoachMemories = [];
            renderCoachMemories([], `Odczyt pamięci Coacha niedostępny: ${friendlyDataError(error)}`);
            return;
        }
        currentCoachMemories = Array.isArray(data) ? data : [];
        renderCoachMemories(currentCoachMemories, "Tylko wzorce potwierdzone lub oczekujące na potwierdzenie.");
    }

    async function reviewProfileCoachMemory(memoryId, action) {
        if (!client || !activeUserId || !memoryId || !["confirm", "reject"].includes(action)) return;
        coachMemorySavingId = memoryId;
        renderCoachMemories(currentCoachMemories, "Zapisywanie zmian w DEV…");
        const { error } = await client.rpc("review_coach_memory", {
            p_memory_id: memoryId,
            p_action: action
        });
        if (error) {
            coachMemorySavingId = null;
            renderCoachMemories(currentCoachMemories, `Nie udało się zmienić pamięci: ${friendlyDataError(error)}`);
            return;
        }
        coachMemorySavingId = null;
        const { data: userResult } = await client.auth.getUser();
        if (userResult?.user) await loadAccountData(userResult.user);
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
        currentWeeklyProgressReport = report || null;
        setText("progress-data-days", `${formatNumber(report?.data_days)} / 7`);
        setText("progress-meals", formatNumber(report?.meals_logged));
        setText("progress-calories", formatNumber(report?.average_calories));
        setText("progress-steps", formatNumber(report?.average_steps));
        setText("progress-water", formatNumber(report?.average_water_ml));
        const change = finiteNumber(report?.weight_change_kg);
        setText("progress-weight-change", change === null
            ? "—"
            : `${change > 0 ? "+" : ""}${weightFormatter.format(change)}`);
        const weightStart = finiteNumber(report?.weight_start_kg);
        const weightEnd = finiteNumber(report?.weight_end_kg);
        setText("progress-report-weight", weightStart === null || weightEnd === null
            ? "Brak danych"
            : `${formatWeight(weightStart)} → ${formatWeight(weightEnd)} kg`);
        setText("progress-report-weight-meta", `${formatNumber(report?.weight_days)} dni z pomiarem${change === null ? "" : ` · zmiana ${change > 0 ? "+" : ""}${formatWeight(change)} kg`}`);
        setText("progress-report-meals", `${formatNumber(report?.meals_logged)} zapisanych posiłków`);
        setText("progress-report-meals-meta", `Dziennik: ${formatNumber(report?.nutrition_days)}/7 dni · zamknięte: ${formatNumber(report?.complete_nutrition_days)}/7`);
        setText("progress-report-hydration", report?.average_water_ml == null ? "—" : `${formatNumber(report.average_water_ml)} ml`);
        setText("progress-report-hydration-meta", `Średnia z ${formatNumber(report?.hydration_days)} dni`);
        setText("progress-report-steps", report?.average_steps == null ? "—" : formatNumber(report.average_steps));
        setText("progress-report-steps-meta", `Średnia z ${formatNumber(report?.steps_days)} dni`);
        setText("progress-report-wellbeing", report?.average_wellbeing_score == null ? "—" : `${formatMacro(report.average_wellbeing_score)} / 5`);
        setText("progress-report-wellbeing-meta", `Średnia z ${formatNumber(report?.wellbeing_days)} dni`);
        const adherenceText = (average, target, percent, unit) =>
            average == null || target == null
                ? "—"
                : `${formatNumber(average)} / ${formatNumber(target)} ${unit} · ${percent == null ? "—" : `${formatNumber(percent)}%`}`;
        setText("progress-report-calories-adherence", adherenceText(report?.average_calories, report?.average_calories_target, report?.calorie_adherence_percent, "kcal"));
        setText("progress-report-protein-adherence", adherenceText(report?.average_protein_g, report?.average_protein_target_g, report?.protein_adherence_percent, "g"));
        setText("progress-report-fat-adherence", adherenceText(report?.average_fat_g, report?.average_fat_target_g, report?.fat_adherence_percent, "g"));
        setText("progress-report-carbs-adherence", adherenceText(report?.average_carbs_g, report?.average_carbs_target_g, report?.carbs_adherence_percent, "g"));
        document.getElementById("progress-summary")?.setAttribute("aria-busy", "false");
        const period = report?.period_start && report?.period_end
            ? `${formatDate(report.period_start)} – ${formatDate(report.period_end)}`
            : "ostatnie 7 dni";
        setText("progress-message", `Raport DEV: ${period}. Wartości wylicza backend aplikacji.`);
    }

    async function shareWeeklyProgressReport() {
        const report = currentWeeklyProgressReport;
        if (!report) {
            setText("progress-message", "Raport tygodniowy nie jest jeszcze dostępny.");
            return;
        }
        const lines = [
            "Project Weight Drop · raport tygodniowy",
            `${formatDate(report.period_start)} – ${formatDate(report.period_end)}`,
            `Dni z danymi: ${formatNumber(report.data_days)}/7`,
            `Waga: ${report.weight_start_kg == null ? "—" : `${formatWeight(report.weight_start_kg)} kg`} → ${report.weight_end_kg == null ? "—" : `${formatWeight(report.weight_end_kg)} kg`}`,
            `Posiłki: ${formatNumber(report.meals_logged)} · dziennik ${formatNumber(report.nutrition_days)}/7 dni`,
            `Kalorie: ${formatNumber(report.average_calories)} / ${formatNumber(report.average_calories_target)} kcal`,
            `Białko: ${formatNumber(report.average_protein_g)} / ${formatNumber(report.average_protein_target_g)} g`,
            `Tłuszcz: ${formatNumber(report.average_fat_g)} / ${formatNumber(report.average_fat_target_g)} g`,
            `Węglowodany: ${formatNumber(report.average_carbs_g)} / ${formatNumber(report.average_carbs_target_g)} g`,
            `Woda: ${report.average_water_ml == null ? "—" : `${formatNumber(report.average_water_ml)} ml`}`,
            `Kroki: ${report.average_steps == null ? "—" : formatNumber(report.average_steps)}`,
            `Samopoczucie: ${report.average_wellbeing_score == null ? "—" : `${formatMacro(report.average_wellbeing_score)}/5`}`
        ];
        const text = lines.join("\n");
        try {
            if (typeof navigator.share === "function") await navigator.share({ title: "Raport tygodniowy · Project Weight Drop", text });
            else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
            else throw new Error("share_unavailable");
            setText("progress-message", "Raport został udostępniony.");
        } catch (error) {
            if (error?.name === "AbortError") return;
            setText("progress-message", "Nie udało się udostępnić raportu na tym urządzeniu.");
        }
    }

    function renderBodyMeasurementHistory(entry, error) {
        const list = document.getElementById("measurement-history-list");
        if (!list) return;
        list.replaceChildren();
        if (error) {
            setText("measurement-history-count", "—");
            const unavailable = document.createElement("p");
            unavailable.className = "empty-history";
            unavailable.textContent = friendlyDataError(error);
            list.append(unavailable);
            return;
        }
        const history = Array.isArray(entry) ? entry : entry ? [entry] : [];
        const latest = history[0] || null;
        const oldest = history[history.length - 1] || null;
        const measurements = [
            ["Talia", "waist_cm"], ["Biodra", "hips_cm"], ["Klatka", "chest_cm"],
            ["Ramię", "arm_cm"], ["Udo", "thigh_cm"]
        ];
        const fields = latest ? measurements.filter(([, key]) => finiteNumber(latest[key]) !== null) : [];
        setText("measurement-history-count", formatNumber(history.length));
        if (!latest || !fields.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Brak zapisanych obwodów na koncie DEV.";
            list.append(empty);
            return;
        }
        const latestHeading = document.createElement("div");
        latestHeading.className = "measurement-history-date";
        latestHeading.textContent = `Ostatni pomiar · ${formatDate(latest.measurement_date)}`;
        list.append(latestHeading);
        fields.forEach(([label, key]) => {
            const current = finiteNumber(latest[key]);
            const baseline = finiteNumber(oldest?.[key]);
            const change = baseline === null ? null : current - baseline;
            const changeText = change === null || Math.abs(change) < 0.05
                ? ""
                : ` (${change > 0 ? "+" : ""}${formatWeight(change)} cm)`;
            list.append(historyRow(label, "", `${formatWeight(current)} cm${changeText}`));
        });
        if (history.length > 1) {
            const historyHeading = document.createElement("div");
            historyHeading.className = "measurement-history-date";
            historyHeading.textContent = "Historia pomiarów";
            list.append(historyHeading);
            history.forEach((day) => {
                const values = measurements
                    .filter(([, key]) => finiteNumber(day[key]) !== null)
                    .map(([label, key]) => `${label}: ${formatWeight(day[key])} cm`);
                if (!values.length) return;
                const row = document.createElement("div");
                row.className = "measurement-history-entry";
                const date = document.createElement("strong");
                date.textContent = formatDate(day.measurement_date);
                const details = document.createElement("small");
                details.textContent = values.join(" · ");
                row.append(date, details);
                list.append(row);
            });
        }
    }

    function renderProgressHub(dashboard, weekly, steps, measurement, event, premium) {
        const today = localToday();
        const todaySteps = (Array.isArray(steps) ? steps : []).find((entry) => entry.summary_date === today)?.steps ?? dashboard?.steps;
        const calories = finiteNumber(dashboard?.calories_consumed);
        const calorieTarget = finiteNumber(dashboard?.calories_target);
        const waist = finiteNumber(measurement?.waist_cm);
        const dataDays = finiteNumber(weekly?.data_days);
        setText("progress-hub-weight", dashboard?.current_weight_kg == null ? "Brak pomiaru" : `${formatWeight(dashboard.current_weight_kg)} kg`);
        setText("progress-hub-water", `${formatNumber(dashboard?.water_ml)} ml dzisiaj`);
        setText("progress-hub-steps", `${formatNumber(todaySteps)} dzisiaj`);
        setText("progress-hub-body", waist === null ? "Brak pomiaru" : `Talia ${formatWeight(waist)} cm`);
        setText("progress-hub-macros", `${formatNumber(calories)} / ${formatNumber(calorieTarget)} kcal`);
        setText("progress-hub-report", dataDays === null ? "Raport niedostępny" : `${formatNumber(dataDays)} / 7 dni danych`);
        setText("progress-hub-event", event
            ? `${event.event_name || "Cel z datą"} · ${event.event_date || ""}`.trim()
            : "Brak wydarzenia");
        const weeklyUpdate = document.getElementById("progress-weekly-update");
        if (weeklyUpdate) weeklyUpdate.hidden = premium?.is_pro !== true;

        setText("progress-macro-calories", `${formatNumber(calories)} / ${formatNumber(calorieTarget)} kcal`);
        setText("progress-macro-protein", `${formatMacro(dashboard?.protein_consumed)} / ${formatMacro(dashboard?.protein_target)} g`);
        setText("progress-macro-fat", `${formatMacro(dashboard?.fat_consumed)} / ${formatMacro(dashboard?.fat_target)} g`);
        setText("progress-macro-carbs", `${formatMacro(dashboard?.carbs_consumed)} / ${formatMacro(dashboard?.carbs_target)} g`);
    }

    function setProgressSection(section) {
        const allowed = new Set(["hub", "challenges", "community", "przemala"]);
        activeProgressSection = allowed.has(section) ? section : "hub";
        activeProgressDestination = null;
        if (progressDetailView) progressDetailView.hidden = true;
        const sectionNav = document.getElementById("progress-section-nav");
        if (sectionNav) sectionNav.hidden = false;
        if (activeProgressSection === "challenges") challengeTab("system-active");
        if (activeProgressSection === "przemala") challengeTab("przemala-active");
        document.querySelectorAll("[data-progress-section-view]").forEach((view) => {
            view.hidden = view.dataset.progressSectionView !== activeProgressSection;
        });
        document.querySelectorAll("[data-progress-section-button]").forEach((button) => {
            const selected = button.dataset.progressSectionButton === activeProgressSection;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-selected", String(selected));
        });
    }

    function detailStat(label, value) {
        const card = document.createElement("article");
        card.className = "progress-detail-stat";
        const caption = document.createElement("small");
        caption.textContent = label;
        const content = document.createElement("b");
        content.textContent = value;
        card.append(caption, content);
        return card;
    }

    function detailChartRow(label, value, maxValue, displayValue) {
        const row = document.createElement("div");
        row.className = "progress-chart-row";
        const name = document.createElement("span");
        name.textContent = label;
        const track = document.createElement("span");
        track.className = "progress-chart-track";
        const fill = document.createElement("i");
        fill.style.width = `${maxValue > 0 ? Math.min(100, Math.max(0, (value / maxValue) * 100)) : 0}%`;
        track.append(fill);
        const amount = document.createElement("b");
        amount.textContent = displayValue;
        row.append(name, track, amount);
        return row;
    }

    function appendProgressInput(form, labelText, inputName, options = {}) {
        const label = document.createElement("label");
        label.textContent = labelText;
        const input = document.createElement("input");
        input.name = inputName;
        input.type = options.type || "number";
        if (options.min !== undefined) input.min = String(options.min);
        if (options.max !== undefined) {
            if (input.type === "text") input.maxLength = Number(options.max);
            else input.max = String(options.max);
        }
        if (options.step !== undefined) input.step = String(options.step);
        if (options.placeholder) input.placeholder = options.placeholder;
        if (options.value !== undefined && options.value !== null) input.value = String(options.value);
        if (options.required) input.required = true;
        if (options.inputmode) input.inputMode = options.inputmode;
        label.append(input);
        form.append(label);
        return input;
    }

    function buildProgressEntry(destination) {
        const form = progressDetailEntryForm;
        const card = document.getElementById("progress-detail-entry-card");
        const heading = document.getElementById("progress-entry-heading");
        if (!form || !card || !heading) return;
        form.replaceChildren();
        form.dataset.destination = destination;
        const profile = currentProgressData.profile;
        const event = currentProgressData.event;
        const addSubmit = (label) => {
            const button = document.createElement("button");
            button.className = "tool-primary-button wide";
            button.type = "submit";
            button.textContent = label;
            form.append(button);
        };

        if (destination === "weight") {
            heading.textContent = "Zapisz pomiar wagi";
            appendProgressInput(form, "Waga (kg)", "weight_kg", {
                min: 35, max: 350, step: 0.1, inputmode: "decimal", required: true,
                value: currentDashboardSnapshot?.current_weight_kg, placeholder: "np. 82,5"
            });
            addSubmit("Zapisz wagę");
        } else if (destination === "water") {
            heading.textContent = "Dodaj wodę";
            appendProgressInput(form, "Ilość wody (ml)", "amount_ml", { min: 50, max: 2000, step: 50, inputmode: "numeric", required: true, placeholder: "np. 300" });
            addSubmit("Zapisz wodę");
        } else if (destination === "steps") {
            heading.textContent = "Zapisz dzisiejsze kroki";
            appendProgressInput(form, "Liczba kroków", "steps", { min: 0, max: 200000, step: 1, inputmode: "numeric", required: true, placeholder: "np. 7500" });
            const help = document.createElement("p");
            help.className = "tool-help";
            help.textContent = "Ten wpis zapisze ręczną liczbę kroków na dzisiejszy dzień. Kroki z Health Connect są dostępne w Androidzie.";
            form.append(help);
            addSubmit("Zapisz kroki");
        } else if (destination === "measurements") {
            heading.textContent = "Zapisz obwody ciała";
            [["Talia (cm)", "waist_cm"], ["Biodra (cm)", "hips_cm"], ["Klatka (cm)", "chest_cm"], ["Ramię (cm)", "arm_cm"], ["Udo (cm)", "thigh_cm"]]
                .forEach(([label, name]) => appendProgressInput(form, label, name, { min: 10, max: 300, step: 0.1, inputmode: "decimal", placeholder: "—" }));
            addSubmit("Zapisz obwody");
        } else if (destination === "event") {
            heading.textContent = event ? "Zmień cel z datą" : "Dodaj cel z datą";
            appendProgressInput(form, "Nazwa wydarzenia", "event_name", { type: "text", max: 80, value: event?.event_name || "", required: true, placeholder: "np. Wakacje" });
            appendProgressInput(form, "Data wydarzenia", "event_date", { type: "date", value: event?.event_date || "", required: true });
            const goalNote = document.createElement("p");
            goalNote.className = "tool-help";
            goalNote.textContent = `Obliczenie korzysta z zapisanego celu profilu: ${formatWeight(profile?.current_weight_kg)} kg → ${formatWeight(profile?.goal_weight_kg)} kg. Nie zmienia kalorii ani makro.`;
            form.append(goalNote);
            addSubmit("Zapisz cel i oblicz");
            if (event) {
                const remove = document.createElement("button");
                remove.className = "tool-secondary-button wide";
                remove.type = "button";
                remove.dataset.progressEventDelete = "true";
                remove.textContent = "Usuń cel z datą";
                form.append(remove);
            }
        } else {
            card.hidden = true;
            return;
        }
        card.hidden = false;
    }

    function renderProgressDestination(destination) {
        if (!progressDetailView) return;
        const viewTitles = {
            weight: "Waga", water: "Nawodnienie", steps: "Kroki", measurements: "Obwody ciała",
            macros: "Kalorie i makro", report: "Raport tygodniowy", event: "Cel z datą",
            "check-in": "Check In", "weekly-update": "Aktualizacja tygodnia"
        };
        activeProgressDestination = destination;
        document.querySelectorAll("[data-progress-section-view]").forEach((view) => { view.hidden = true; });
        document.getElementById("progress-section-nav").hidden = true;
        progressDetailView.hidden = false;
        setText("progress-detail-title", viewTitles[destination] || "Postęp");
        const current = document.getElementById("progress-detail-current");
        const chart = document.getElementById("progress-detail-chart");
        if (!current || !chart) return;
        current.replaceChildren();
        chart.replaceChildren();
        const { profile, daily, weights, measurements, event } = currentProgressData;
        const today = (Array.isArray(daily) ? daily : []).find((entry) => entry.summary_date === localToday()) || null;
        const recentDays = (Array.isArray(daily) ? daily : []).slice(0, 7).reverse();
        let summary = "Odczyt zapisanych danych konta DEV.";

        if (destination === "weight") {
            const value = finiteNumber(currentDashboardSnapshot?.current_weight_kg);
            const change = finiteNumber(currentDashboardSnapshot?.weight_change_kg);
            current.append(detailStat("Aktualna waga", value === null ? "Brak pomiaru" : `${formatWeight(value)} kg`));
            current.append(detailStat("Cel", finiteNumber(profile?.goal_weight_kg) === null ? "—" : `${formatWeight(profile.goal_weight_kg)} kg`));
            current.append(detailStat("Zmiana", change === null ? "—" : `${change > 0 ? "+" : ""}${formatWeight(change)} kg`));
            const rows = (Array.isArray(weights) ? weights : []).slice(0, 10).reverse();
            const max = Math.max(1, ...rows.map((row) => finiteNumber(row.weight_kg) || 0));
            rows.forEach((row) => chart.append(detailChartRow(formatDate(row.measured_at, true), finiteNumber(row.weight_kg) || 0, max, `${formatWeight(row.weight_kg)} kg`)));
            if (!rows.length) chart.textContent = "Historia pomiarów pokaże się tutaj po pierwszym zapisie.";
            summary = `${rows.length} ostatnich pomiarów z historii konta.`;
        } else if (destination === "water") {
            const total = finiteNumber(currentDashboardSnapshot?.water_ml) ?? 0;
            current.append(detailStat("Dzisiaj", `${formatNumber(total)} ml`));
            current.append(detailStat("Cel dzienny", `${formatNumber(currentDashboardSnapshot?.water_target_ml)} ml`));
            const max = Math.max(1, ...recentDays.map((row) => finiteNumber(row.water_ml) || 0));
            recentDays.forEach((row) => chart.append(detailChartRow(formatDate(row.summary_date), finiteNumber(row.water_ml) || 0, max, `${formatNumber(row.water_ml)} ml`)));
            if (!recentDays.length) chart.textContent = "Historia nawodnienia pokaże się po zapisaniu danych.";
            summary = "Rzeczywiste dzienne zapisy nawodnienia z ostatnich dni.";
        } else if (destination === "steps") {
            const todaySteps = finiteNumber(today?.steps) ?? finiteNumber(currentDashboardSnapshot?.steps);
            current.append(detailStat("Dzisiaj", todaySteps === null ? "Brak dzisiejszego zapisu" : `${formatNumber(todaySteps)} kroków`));
            current.append(detailStat("Średnia tygodniowa", formatNumber(currentWeeklyProgressReport?.average_steps)));
            current.append(detailStat("Dni z zapisem", `${formatNumber(currentWeeklyProgressReport?.steps_days)} / 7`));
            const max = Math.max(1, ...recentDays.map((row) => finiteNumber(row.steps) || 0));
            recentDays.forEach((row) => chart.append(detailChartRow(formatDate(row.summary_date), finiteNumber(row.steps) || 0, max, `${formatNumber(row.steps)} kroków`)));
            if (!recentDays.length) chart.textContent = "Historia kroków pokaże się po zapisaniu danych.";
            summary = "Rzeczywiste zapisy kroków z konta. Nowy wpis zastępuje dzisiejszą wartość.";
        } else if (destination === "measurements") {
            const latest = measurements?.[0] || null;
            const fields = [["Talia", "waist_cm"], ["Biodra", "hips_cm"], ["Klatka", "chest_cm"], ["Ramię", "arm_cm"], ["Udo", "thigh_cm"]];
            fields.forEach(([label, key]) => { if (finiteNumber(latest?.[key]) !== null) current.append(detailStat(label, `${formatWeight(latest[key])} cm`)); });
            if (!current.childElementCount) current.append(detailStat("Obwody", "Brak pomiaru"));
            (Array.isArray(measurements) ? measurements : []).slice(0, 10).forEach((row) => {
                const values = fields.filter(([, key]) => finiteNumber(row[key]) !== null).map(([label, key]) => `${label.toLowerCase()} ${formatWeight(row[key])} cm`);
                chart.append(detailChartRow(formatDate(row.measurement_date), values.length, 5, values.join(" · ") || "—"));
            });
            if (!measurements?.length) chart.textContent = "Historia obwodów pokaże się po pierwszym zapisie.";
            summary = `${formatNumber(measurements?.length)} pomiarów zapisanych na koncie DEV.`;
        } else if (destination === "event") {
            if (!event) {
                current.append(detailStat("Cel z datą", "Nie ustawiono"));
                summary = "Dodaj wydarzenie, żeby obliczyć orientacyjny zakres postępu.";
            } else {
                const projection = eventProjectionResult(event.event_date, finiteNumber(profile?.current_weight_kg), finiteNumber(profile?.goal_weight_kg));
                current.append(detailStat("Wydarzenie", event.event_name || "Cel z datą"));
                current.append(detailStat("Termin", formatDate(event.event_date)));
                if (projection) {
                    current.append(detailStat("Pozostało", `${projection.days} dni`));
                    current.append(detailStat("Orientacyjna zmiana", `${formatWeight(projection.minimumLossKg)}–${formatWeight(projection.maximumLossKg)} kg`));
                }
                summary = "Cel i termin zapisane na koncie DEV; prognoza nie zmienia planu żywieniowego.";
            }
            if (event) chart.textContent = "Postęp wagi i terminu bazuje na Twoich rzeczywistych zapisach. Aktualny pomiar znajdziesz w sekcji Waga.";
        } else if (destination === "macros") {
            const dashboard = currentDashboardSnapshot || {};
            [["Kalorie", dashboard.calories_consumed, dashboard.calories_target, "kcal"], ["Białko", dashboard.protein_consumed, dashboard.protein_target, "g"], ["Tłuszcz", dashboard.fat_consumed, dashboard.fat_target, "g"], ["Węglowodany", dashboard.carbs_consumed, dashboard.carbs_target, "g"]].forEach(([label, actual, target, unit]) => {
                const amount = finiteNumber(actual) ?? 0;
                const goal = finiteNumber(target) ?? 0;
                current.append(detailStat(`${label} · dzisiaj`, `${formatNumber(amount)} / ${formatNumber(goal)} ${unit}`));
                chart.append(detailChartRow(label, amount, goal || 1, `${formatNumber(amount)} / ${formatNumber(goal)} ${unit}`));
            });
            summary = "Bieżące spożycie z dziennika i cele zapisane w aktywnym planie DEV.";
        } else if (destination === "report") {
            const report = currentWeeklyProgressReport || {};
            current.append(detailStat("Dni z danymi", `${formatNumber(report.data_days)} / 7`));
            current.append(detailStat("Średnie kroki", formatNumber(report.average_steps)));
            current.append(detailStat("Średnia woda", report.average_water_ml == null ? "—" : `${formatNumber(report.average_water_ml)} ml`));
            current.append(detailStat("Zmiana wagi", report.weight_change_kg == null ? "—" : `${formatWeight(report.weight_change_kg)} kg`));
            chart.textContent = `${formatNumber(report.meals_logged)} posiłków · ${formatNumber(report.average_calories)} kcal średnio dziennie · ${formatNumber(report.average_wellbeing_score)} / 5 samopoczucie`;
            summary = report.period_start && report.period_end ? `${formatDate(report.period_start)} – ${formatDate(report.period_end)} · podsumowanie z backendu DEV.` : "Podsumowanie z ostatnich 7 dni z backendu DEV.";
        } else {
            current.append(detailStat(destination === "check-in" ? "Check In" : "Aktualizacja tygodnia", "Dostępne w Androidzie"));
            chart.textContent = destination === "check-in"
                ? "Natywny Check In Androida używa dodatkowych danych urządzenia. Zapisy wagi, kroków, wody i obwodów są dostępne w tej aplikacji webowej."
                : "Ten przepływ aktualizuje plan w Androidzie. Strona pokazuje Twoje zapisane postępy, ale nie zmienia wyliczeń.";
            summary = "Funkcja natywna Androida; pozostałe dane postępu są dostępne online.";
        }
        setText("progress-detail-summary", summary);
        buildProgressEntry(destination);
    }

    function openProgressDestination(destination) {
        if (destination === "weekly-update" || destination === "check-in" || ["weight", "water", "steps", "measurements", "event", "macros", "report"].includes(destination)) {
            document.getElementById("progress-section-nav").hidden = true;
            renderProgressDestination(destination);
        }
    }

    async function saveProgressEntry(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const destination = form.dataset.destination;
        const values = new FormData(form);
        const button = form.querySelector('[type="submit"]');
        if (!requireHealthWrite("progress-detail-status")) return;
        if (button) { button.disabled = true; button.textContent = "Zapisywanie…"; }
        setToolStatus("progress-detail-status", "Zapisywanie w DEV…");

        let result = { error: null };
        if (destination === "weight") {
            const weight = Number(String(values.get("weight_kg") || "").replace(",", "."));
            if (!Number.isFinite(weight) || weight < 35 || weight > 350) {
                result.error = { message: "Wpisz wagę od 35 do 350 kg." };
            } else {
                result = await client.rpc("log_weight", { p_weight_kg: weight, p_measured_at: new Date().toISOString() });
            }
        } else if (destination === "water") {
            const amount = Number(values.get("amount_ml"));
            if (!Number.isInteger(amount) || amount < 50 || amount > 2000) result.error = { message: "Wpisz od 50 do 2000 ml." };
            else result = await client.rpc("log_water", { p_amount_ml: amount });
        } else if (destination === "steps") {
            const steps = Number(values.get("steps"));
            if (!Number.isInteger(steps) || steps < 0 || steps > 200000) result.error = { message: "Wpisz liczbę kroków od 0 do 200 000." };
            else result = await client.rpc("log_steps", { p_steps: steps });
        } else if (destination === "measurements") {
            const body = {};
            [["waist_cm", "p_waist_cm"], ["hips_cm", "p_hips_cm"], ["chest_cm", "p_chest_cm"], ["arm_cm", "p_arm_cm"], ["thigh_cm", "p_thigh_cm"]].forEach(([name, key]) => {
                const raw = String(values.get(name) || "").trim();
                if (!raw) body[key] = null;
                else body[key] = Number(raw.replace(",", "."));
            });
            const entries = Object.values(body).filter((value) => value !== null);
            if (!entries.length) result.error = { message: "Wpisz przynajmniej jeden obwód." };
            else if (entries.some((value) => !Number.isFinite(value) || value < 10 || value > 300)) result.error = { message: "Każdy obwód musi mieścić się w zakresie 10–300 cm." };
            else result = await client.rpc("save_body_measurements", body);
        } else if (destination === "event") {
            const name = String(values.get("event_name") || "").trim();
            const date = String(values.get("event_date") || "");
            const profile = currentProgressData.profile;
            const projection = eventProjectionResult(date, finiteNumber(profile?.current_weight_kg), finiteNumber(profile?.goal_weight_kg));
            if (!name || name.length > 80 || !date) result.error = { message: "Podaj nazwę wydarzenia i prawidłową datę." };
            else if (date <= localToday()) result.error = { message: "Data wydarzenia musi być późniejsza niż dzisiaj." };
            else if (!projection) result.error = { message: "Uzupełnij prawidłową aktualną i docelową wagę w profilu." };
            else result = await client.rpc("save_event_goal", { p_event_name: name, p_event_date: date });
        } else {
            result.error = { message: "Ten ekran nie przyjmuje nowych zapisów." };
        }

        if (button) { button.disabled = false; button.textContent = destination === "weight" ? "Zapisz wagę" : destination === "water" ? "Zapisz wodę" : destination === "steps" ? "Zapisz kroki" : destination === "measurements" ? "Zapisz obwody" : "Zapisz cel i oblicz"; }
        if (result.error) {
            const message = ["Wpisz wagę od 35 do 350 kg.", "Wpisz od 50 do 2000 ml.", "Wpisz liczbę kroków od 0 do 200 000.", "Wpisz przynajmniej jeden obwód.", "Każdy obwód musi mieścić się w zakresie 10–300 cm.", "Podaj nazwę wydarzenia i prawidłową datę.", "Data wydarzenia musi być późniejsza niż dzisiaj.", "Uzupełnij prawidłową aktualną i docelową wagę w profilu."].includes(result.error.message)
                ? result.error.message
                : healthWriteError(result.error, "Nie udało się zapisać danych w DEV.");
            setToolStatus("progress-detail-status", message, "error");
            return;
        }

        const savedMessage = destination === "weight" ? "Pomiar wagi zapisany na Twoim koncie DEV."
            : destination === "water" ? "Woda dopisana do dzisiejszego zapisu DEV."
                : destination === "steps" ? "Dzisiejsza liczba kroków zapisana w DEV."
                    : destination === "measurements" ? "Obwody ciała zapisane w DEV."
                        : "Cel z datą zapisany i obliczony.";
        await refreshAccountData();
        setToolStatus("progress-detail-status", savedMessage, "success");
    }

    async function deleteProgressEvent() {
        if (!requireHealthWrite("progress-detail-status")) return;
        const remove = progressDetailEntryForm?.querySelector("[data-progress-event-delete]");
        if (remove) { remove.disabled = true; remove.textContent = "Usuwanie…"; }
        const { error } = await client.rpc("delete_event_goal");
        if (error) {
            if (remove) { remove.disabled = false; remove.textContent = "Usuń cel z datą"; }
            setToolStatus("progress-detail-status", healthWriteError(error, "Nie udało się usunąć celu."), "error");
            return;
        }
        await refreshAccountData();
        setToolStatus("progress-detail-status", "Cel z datą został usunięty z DEV.", "success");
    }

    async function loadCommunityDataForActiveUser() {
        const { data, error } = await client?.auth.getUser() || {};
        if (!error && data?.user && data.user.id === activeUserId) await loadCommunityData(data.user);
    }

    function setMealsView(view) {
        activeMealsView = view === "diary" ? "diary" : "plan";
        const planView = document.getElementById("meals-plan-view");
        const diaryView = document.getElementById("meals-diary-view");
        if (planView) planView.hidden = activeMealsView !== "plan";
        if (diaryView) diaryView.hidden = activeMealsView !== "diary";
        document.querySelectorAll("[data-meals-view]").forEach((button) => {
            const selected = button.dataset.mealsView === activeMealsView;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-selected", String(selected));
            const check = button.querySelector("span");
            if (check) check.hidden = !selected;
        });
        if (activeMealsView === "diary") {
            document.getElementById("meals-diary-view")?.scrollIntoView({ block: "start", behavior: "smooth" });
        }
    }

    function renderTodayMeals(rows) {
        const list = document.getElementById("today-meals-list");
        if (!list) return;
        list.replaceChildren();
        const meals = Array.isArray(rows) ? rows : [];
        currentTodayMeals = meals;
        setText("today-meals-count", formatNumber(meals.length));
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
            const actions = document.createElement("div");
            const kcal = document.createElement("strong");
            const deleteButton = document.createElement("button");
            title.textContent = formatMealType(meal.meal_type);
            items.textContent = (Array.isArray(meal.items) ? meal.items : []).map((item) => item.name).join(", ") || "Bez listy składników";
            kcal.textContent = `${formatNumber(meal.calories)} kcal`;
            actions.className = "meal-log-actions";
            deleteButton.type = "button";
            deleteButton.textContent = "×";
            deleteButton.setAttribute("aria-label", `Usuń ${formatMealType(meal.meal_type).toLowerCase()}`);
            deleteButton.addEventListener("click", () => void deleteTodayMeal(String(meal.id || "")));
            copy.append(title, items);
            actions.append(kcal, deleteButton);
            top.append(copy, actions);
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
        const preferencesStatus = document.getElementById("meal-plan-preferences-status");
        if (preferencesStatus) preferencesStatus.hidden = currentMealPreferences?.complete !== true;
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
        document.querySelector(".meal-plan-access")?.classList.toggle(
            "ready",
            !premiumSnapshotUnavailable && premium?.meal_plan_allowed === true && !mealPlanGenerationRequirement(selectedMealPlanDay)
        );
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
        const generatedDays = new Set((currentMealPlan?.days || [])
            .map((day) => Number(day.day_index))
            .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6));
        setText("meal-plan-generated-count", `${generatedDays.size} z 7`);
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

    function mealDraftNutrition(item, field) {
        const per100 = finiteNumber(item?.food?.[field]) ?? 0;
        const grams = finiteNumber(item?.grams) ?? 0;
        return (per100 * grams) / 100;
    }

    function renderMealDraft() {
        const panel = document.getElementById("meal-draft-panel");
        const list = document.getElementById("meal-draft-list");
        if (!panel || !list) return;
        panel.hidden = mealDraftItems.length === 0;
        list.replaceChildren();
        let calories = 0;
        let protein = 0;
        let fat = 0;
        let carbs = 0;
        mealDraftItems.forEach((item, index) => {
            calories += mealDraftNutrition(item, "calories_per_100g");
            protein += mealDraftNutrition(item, "protein_per_100g");
            fat += mealDraftNutrition(item, "fat_per_100g");
            carbs += mealDraftNutrition(item, "carbs_per_100g");
            const row = document.createElement("div");
            row.className = "meal-draft-item";
            const name = document.createElement("strong");
            const grams = document.createElement("span");
            const remove = document.createElement("button");
            name.textContent = item.food.name || "Produkt";
            grams.textContent = `${formatNumber(item.grams)} g`;
            remove.type = "button";
            remove.textContent = "×";
            remove.setAttribute("aria-label", `Usuń ${name.textContent}`);
            remove.disabled = mealDraftBusy;
            remove.addEventListener("click", () => {
                mealDraftItems = mealDraftItems.filter((_, itemIndex) => itemIndex !== index);
                renderMealDraft();
            });
            row.append(name, grams, remove);
            list.append(row);
        });
        setText("meal-draft-calories", formatNumber(calories));
        setText("meal-draft-macros", `Białko ${formatMacro(protein)} g · Tłuszcz ${formatMacro(fat)} g · Węgle ${formatMacro(carbs)} g`);
        if (saveMealDraftButton) {
            saveMealDraftButton.disabled = mealDraftBusy || mealDraftItems.length === 0;
            saveMealDraftButton.textContent = mealDraftBusy ? "Zapisywanie…" : "Zapisz";
        }
    }

    function openMealGrams(food, trigger) {
        if (!food?.id || !mealGramsModal || !mealGramsValue) return;
        selectedFoodForGrams = food;
        mealGramsPreviousFocus = trigger || document.activeElement;
        setText("meal-grams-copy", `${food.name || "Produkt"} · ${formatNumber(food.calories_per_100g)} kcal / 100 g`);
        setText("meal-grams-status", "");
        mealGramsValue.value = "100";
        mealGramsModal.hidden = false;
        document.body.classList.add("modal-open");
        window.setTimeout(() => {
            mealGramsValue.focus();
            mealGramsValue.select();
        }, 0);
    }

    function closeMealGrams() {
        if (!mealGramsModal) return;
        mealGramsModal.hidden = true;
        selectedFoodForGrams = null;
        document.body.classList.remove("modal-open");
        mealGramsPreviousFocus?.focus?.();
        mealGramsPreviousFocus = null;
    }

    async function saveMealDraft() {
        if (!client || !activeUserId || !mealDraftItems.length || mealDraftBusy) return;
        mealDraftBusy = true;
        renderMealDraft();
        setToolStatus("meal-draft-status", "Zapisuję posiłek w DEV…");
        try {
            const { error } = await client.rpc("log_meal", {
                p_meal_type: selectedManualMealType,
                p_items: mealDraftItems.map((item) => ({ food_id: item.food.id, grams: item.grams })),
                p_eaten_at: new Date().toISOString()
            });
            if (error) {
                setToolStatus("meal-draft-status", friendlyDataError(error), "error");
                return;
            }
            mealDraftItems = [];
            renderMealDraft();
            await refreshMealViews(selectedMealPlanDay);
            setMealsView("diary");
            setText("meals-message", "Posiłek zapisano w dzisiejszym dzienniku DEV.");
        } catch {
            setToolStatus("meal-draft-status", "Nie udało się zapisać posiłku DEV.", "error");
        } finally {
            mealDraftBusy = false;
            renderMealDraft();
        }
    }

    async function deleteTodayMeal(mealId) {
        if (!client || !activeUserId || !mealId || mealDraftBusy) return;
        if (!window.confirm("Usunąć ten posiłek z dzisiejszego dziennika?")) return;
        mealDraftBusy = true;
        setText("meals-message", "Usuwam posiłek z dziennika DEV…");
        try {
            const { error } = await client.rpc("delete_meal", { p_meal_id: mealId });
            if (error) {
                setText("meals-message", friendlyDataError(error));
                return;
            }
            await refreshMealViews(selectedMealPlanDay);
            setMealsView("diary");
            setText("meals-message", "Posiłek usunięto z dzisiejszego dziennika DEV.");
        } catch {
            setText("meals-message", "Nie udało się usunąć posiłku DEV.");
        } finally {
            mealDraftBusy = false;
        }
    }

    async function closeTodayFoodDay() {
        if (!client || !activeUserId || mealDraftBusy) return;
        if (!currentTodayMeals.length && !window.confirm("Nie zapisano dziś żadnego jedzenia. Czy był to celowy dzień postu?")) return;
        mealDraftBusy = true;
        if (closeFoodDayButton) {
            closeFoodDayButton.disabled = true;
            closeFoodDayButton.textContent = "Zamykanie…";
        }
        setText("meals-message", "Zamykam dzisiejszy dziennik DEV…");
        try {
            const { error } = await client.rpc("set_food_day_complete", { p_complete: true });
            setText("meals-message", error ? friendlyDataError(error) : "Dzisiejszy dziennik został zamknięty w DEV.");
        } catch {
            setText("meals-message", "Nie udało się zamknąć dzisiejszego dziennika DEV.");
        } finally {
            mealDraftBusy = false;
            if (closeFoodDayButton) {
                closeFoodDayButton.disabled = false;
                closeFoodDayButton.textContent = "Zamknij dzisiejszy dziennik";
            }
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
            const actions = document.createElement("div");
            const kcal = document.createElement("span");
            const add = document.createElement("button");
            name.textContent = food.name || "Produkt";
            detail.textContent = `${food.brand || "Bez marki"} · B ${formatNumber(food.protein_per_100g)} · T ${formatNumber(food.fat_per_100g)} · W ${formatNumber(food.carbs_per_100g)} / 100 g`;
            kcal.textContent = `${formatNumber(food.calories_per_100g)} kcal`;
            actions.className = "food-result-actions";
            add.type = "button";
            const remoteOnly = food.source === "open_food_facts_remote" || !food.id;
            add.textContent = remoteOnly ? "Tylko Android" : "Dodaj";
            add.disabled = remoteOnly;
            if (!remoteOnly) add.addEventListener("click", () => openMealGrams(food, add));
            copy.append(name, detail);
            actions.append(kcal, add);
            row.append(copy, actions);
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

    function setFridgeBusy(busy) {
        fridgeActionBusy = busy;
        [fridgeGenerateButton, fridgeAddTodayButton, fridgeRegenerateButton, fridgeChangeProductsButton, fridgeResetButton]
            .filter(Boolean)
            .forEach((button) => {
                button.disabled = busy || (button === fridgeGenerateButton && (fridgeProducts?.value.trim().length || 0) < 3);
            });
        if (fridgeProducts) fridgeProducts.disabled = busy;
        if (fridgeCustomCalories) fridgeCustomCalories.disabled = busy;
        document.querySelectorAll("[data-fridge-mode]").forEach((button) => { button.disabled = busy; });
    }

    function fridgeCustomTarget() {
        if (activeFridgeMode !== "custom") return null;
        const calories = finiteNumber(fridgeCustomCalories?.value);
        if (calories === null || calories < 100 || calories > 3000) return false;
        return { calories: Math.round(calories), protein_g: null, fat_g: null, carbs_g: null };
    }

    function fridgeProposalText(proposal) {
        if (!proposal) return "";
        const parts = [
            proposal.title,
            proposal.fit_note_pl,
            proposal.instructions_pl,
            ...(Array.isArray(proposal.ingredients) ? proposal.ingredients.map((item) => `${item.name || item.declared_product || "Składnik"} ${formatNumber(item.grams)} g`) : [])
        ];
        return parts.filter(Boolean).join("\n");
    }

    function renderFridgeProposal(proposal) {
        const result = document.getElementById("fridge-result");
        const ingredients = document.getElementById("fridge-ingredients");
        if (!result || !ingredients) return;
        currentFridgeProposal = proposal || null;
        setText("fridge-meal-type", formatMealType(proposal?.meal_type));
        setText("fridge-result-title", proposal?.title || "Propozycja posiłku");
        setText("fridge-fit", finiteNumber(proposal?.fit_percent) === null ? "—" : `Dopasowanie ${formatNumber(proposal.fit_percent)}%`);
        setText("fridge-fit-note", proposal?.fit_note_pl || "Dopasowano do aktualnego planu DEV.");
        setText("fridge-calories", `${formatNumber(proposal?.totals?.calories)} kcal`);
        setText("fridge-protein", `${formatMacro(proposal?.totals?.protein_g)} g`);
        setText("fridge-fat", `${formatMacro(proposal?.totals?.fat_g)} g`);
        setText("fridge-carbs", `${formatMacro(proposal?.totals?.carbs_g)} g`);
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
        result.hidden = !proposal;
        if (fridgeEmptyState) fridgeEmptyState.hidden = Boolean(proposal);
    }

    async function generateFridgeProposal(products, { regenerate = false } = {}) {
        const customTarget = fridgeCustomTarget();
        if (customTarget === false) {
            setFridgeStatus("Cel posiłku musi mieć od 100 do 3000 kcal.", true);
            fridgeCustomCalories?.focus();
            return;
        }
        currentFridgeProducts = products;
        setFridgeBusy(true);
        setFridgeStatus(regenerate ? "Szukam innej propozycji z tych produktów…" : "Lodówka DEV analizuje produkty i aktualny plan…");
        document.getElementById("fridge-result")?.setAttribute("hidden", "");
        if (fridgeEmptyState) fridgeEmptyState.hidden = false;
        const { data, error } = await client.functions.invoke("fridge-meal", {
            body: {
                action: "generate",
                products,
                avoid_titles: regenerate && currentFridgeProposal?.title ? [currentFridgeProposal.title] : [],
                custom_target: customTarget,
                language: "pl"
            }
        });
        setFridgeBusy(false);
        if (error || data?.error || !data?.proposal) {
            const code = await edgeFunctionErrorCode(error, data);
            setFridgeStatus(featureErrorMessage(code, "Lodówki"), true);
            return;
        }
        renderFridgeProposal(data.proposal);
        setFridgeStatus("Propozycja gotowa. Możesz ją dodać do dzisiejszego bilansu DEV.");
    }

    async function commitFridgeProposal() {
        if (!currentFridgeProposal || fridgeActionBusy || !client || !activeUserId) return;
        setFridgeBusy(true);
        setFridgeStatus("Dodaję posiłek do dzisiejszego bilansu DEV…");
        const { data, error } = await client.functions.invoke("fridge-meal", {
            body: {
                action: "commit",
                products: currentFridgeProposal.inventory_text || currentFridgeProducts,
                custom_target: currentFridgeProposal.custom_target || null,
                proposal: currentFridgeProposal,
                language: "pl"
            }
        });
        setFridgeBusy(false);
        if (error || data?.error || !data?.proposal) {
            const code = await edgeFunctionErrorCode(error, data);
            setFridgeStatus(featureErrorMessage(code, "zapisu posiłku z Lodówki"), true);
            return;
        }
        currentFridgeProposal = data.proposal;
        renderFridgeProposal(data.proposal);
        setFridgeStatus("Dodano do dzisiejszego bilansu DEV.");
        await refreshMealViews();
    }

    async function reportFridgeProposal() {
        if (!currentFridgeProposal || fridgeReportBusy || !client || !activeUserId) return;
        fridgeReportBusy = true;
        if (fridgeReportButton) fridgeReportButton.disabled = true;
        setFridgeStatus("Zapisuję zgłoszenie odpowiedzi AI…");
        const { error } = await client.rpc("report_ai_content", {
            p_source: "fridge",
            p_source_content_id: currentFridgeProposal.title || null,
            p_content_text: fridgeProposalText(currentFridgeProposal).slice(0, 5000)
        });
        fridgeReportBusy = false;
        if (fridgeReportButton) fridgeReportButton.disabled = false;
        if (error) {
            setFridgeStatus(friendlyDataError(error), true);
            return;
        }
        setFridgeStatus("Zgłoszenie zapisane.");
    }

    function coachMessageElement(message) {
        const item = document.createElement("article");
        item.className = `coach-message ${message.role === "user" ? "user" : "assistant"}`;
        const text = document.createElement("p");
        text.textContent = message.message_text || message.message || "";
        item.append(text);
        if (message.created_at) {
            const time = document.createElement("small");
            time.textContent = formatDate(message.created_at, true);
            item.append(time);
        }
        if (message.role !== "user" && (message.message_text || message.message)) {
            const report = document.createElement("button");
            report.type = "button";
            report.className = "coach-report-button";
            report.textContent = "Zgłoś odpowiedź";
            report.addEventListener("click", () => void reportCoachMessage(message, report));
            item.append(report);
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
        if (currentPremiumSnapshot?.coach_allowed === false) {
            setText("coach-status", "AI Coach wymaga aktywnego dostępu PRO.");
            return;
        }
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
        if (currentPremiumSnapshot) {
            currentPremiumSnapshot = {
                ...currentPremiumSnapshot,
                coach_remaining: data.coach_remaining ?? currentPremiumSnapshot.coach_remaining
            };
        }
        updateCoachContextCard();
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

    async function reportCoachMessage(message, button) {
        if (!client || !activeUserId) return;
        const content = String(message?.message_text || message?.message || "").trim();
        if (!content) return;
        button.disabled = true;
        const previous = button.textContent;
        button.textContent = "Zapisuję…";
        const { error } = await client.rpc("report_ai_content", {
            p_source: "coach",
            p_source_content_id: message.id || null,
            p_content_text: content.slice(0, 5000)
        });
        if (error) {
            button.disabled = false;
            button.textContent = previous;
            setText("coach-status", friendlyDataError(error));
            return;
        }
        button.textContent = "Zgłoszono";
        setText("coach-status", "Zgłoszenie odpowiedzi AI zapisane.");
    }

    function challengeOriginLabel(origin) {
        return origin === "przemala" ? "Przemala" : "System";
    }

    function challengeTab(selected) {
        document.querySelectorAll("[data-challenge-view]").forEach((button) => {
            const active = button.dataset.challengeView === selected;
            button.classList.toggle("active", active);
            button.setAttribute("aria-selected", String(active));
        });
        document.querySelectorAll("[data-challenge-panel]").forEach((panel) => {
            panel.hidden = panel.dataset.challengePanel !== selected;
        });
    }

    function renderChallengeList(targetId, snapshot, origin) {
        const target = document.getElementById(targetId);
        if (!target) return;
        target.replaceChildren();
        const challenges = Array.isArray(snapshot?.active_challenges) ? snapshot.active_challenges : [];
        if (!challenges.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = origin === "przemala" ? "Wkrótce pojawi się nowy Challenge od Przemali." : "Wyzwanie 30 dni jest teraz niedostępne.";
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
            points.textContent = `${formatNumber(challenge.earned_points)} / ${formatNumber(challenge.points)} pkt`;
            heading.append(copy, points);
            card.append(heading);

            if (challenge.reward_label_pl) {
                const reward = document.createElement("small");
                reward.className = "challenge-reward-label";
                reward.textContent = `Nagroda: ${challenge.reward_label_pl}`;
                card.append(reward);
            }

            const progressValue = finiteNumber(challenge.progress) ?? 0;
            const progressTarget = finiteNumber(challenge.target) ?? 0;
            const progressPercent = progressTarget > 0 ? Math.min(100, Math.max(0, (progressValue / progressTarget) * 100)) : 0;
            const progress = document.createElement("div");
            progress.className = "challenge-progress";
            progress.setAttribute("role", "progressbar");
            progress.setAttribute("aria-valuemin", "0");
            progress.setAttribute("aria-valuemax", String(progressTarget || 1));
            progress.setAttribute("aria-valuenow", String(Math.min(progressTarget || 1, progressValue)));
            const fill = document.createElement("i");
            fill.style.width = `${progressPercent}%`;
            progress.append(fill);
            const meta = document.createElement("small");
            const dateRange = challenge.starts_at && challenge.ends_at ? ` · ${formatDate(challenge.starts_at)}–${formatDate(challenge.ends_at)}` : "";
            meta.textContent = challenge.joined
                ? `Zaliczone dni: ${formatNumber(progressValue)} / ${formatNumber(progressTarget)} · Dzień ${formatNumber(challenge.current_day)} / ${formatNumber(progressTarget)}${dateRange}`
                : `Jeszcze nie dołączono${dateRange}`;
            card.append(progress, meta);

            if (!challenge.joined) {
                const join = document.createElement("button");
                join.type = "button";
                join.className = "tool-primary-button wide challenge-join-button";
                join.dataset.challengeJoin = challenge.id;
                join.disabled = !snapshot?.profile_ready;
                join.textContent = snapshot?.profile_ready ? "Dołącz do wyzwania" : "Najpierw zaakceptuj zasady Społeczności";
                card.append(join);
            } else if (Array.isArray(challenge.days) && challenge.days.length) {
                const selectedNumber = challengeDaySelection.get(challenge.id) || challenge.current_day || 1;
                const selectedDay = challenge.days.find((day) => Number(day.day_number) === Number(selectedNumber)) || challenge.days[0];
                if (selectedDay) {
                    const strip = document.createElement("div");
                    strip.className = "challenge-day-strip";
                    challenge.days.forEach((day) => {
                        const dayButton = document.createElement("button");
                        dayButton.type = "button";
                        dayButton.dataset.challengeDaySelect = challenge.id;
                        dayButton.dataset.dayNumber = String(day.day_number);
                        dayButton.textContent = String(day.day_number);
                        dayButton.classList.toggle("active", Number(day.day_number) === Number(selectedDay.day_number));
                        dayButton.classList.toggle("completed", day.status === "completed");
                        dayButton.disabled = day.status === "locked";
                        strip.append(dayButton);
                    });
                    card.append(strip);
                    const dayPanel = document.createElement("div");
                    dayPanel.className = "challenge-day-detail";
                    const dayTitle = document.createElement("h5");
                    dayTitle.textContent = `Dzień ${formatNumber(selectedDay.day_number)} · ${selectedDay.title_pl || "Zadanie"}`;
                    const dayDescription = document.createElement("p");
                    dayDescription.textContent = selectedDay.description_pl || "";
                    dayPanel.append(dayTitle, dayDescription);
                    if (selectedDay.alternative_pl) {
                        const alternative = document.createElement("small");
                        alternative.textContent = `Alternatywa: ${selectedDay.alternative_pl}`;
                        dayPanel.append(alternative);
                    }
                    if (selectedDay.safety_pl) {
                        const safety = document.createElement("small");
                        safety.textContent = `Bezpieczeństwo: ${selectedDay.safety_pl}`;
                        dayPanel.append(safety);
                    }
                    const complete = document.createElement("button");
                    complete.type = "button";
                    complete.dataset.challengeComplete = challenge.id;
                    complete.dataset.dayId = selectedDay.id;
                    complete.disabled = selectedDay.status !== "available";
                    complete.textContent = selectedDay.status === "completed" ? "Dzień zapisany" : selectedDay.status === "available" ? "Zapisz wykonanie dnia" : selectedDay.status === "missed" ? "Termin tego dnia minął" : "Ten dzień nie jest jeszcze dostępny";
                    dayPanel.append(complete);
                    card.append(dayPanel);
                }
            }
            target.append(card);
        });
    }

    function renderLeaderboard(targetId, rows, emptyMessage = "Ranking DEV jest jeszcze pusty.") {
        const target = document.getElementById(targetId);
        if (!target) return;
        target.replaceChildren();
        if (!rows.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = emptyMessage;
            target.append(empty);
            return;
        }
        rows.slice(0, 20).forEach((entry) => {
            const row = document.createElement("article");
            row.className = `leaderboard-row${entry.is_current_user ? " current" : ""}`;
            const rank = document.createElement("b");
            rank.textContent = `#${formatNumber(entry.rank)}`;
            const name = document.createElement("strong");
            name.textContent = entry.display_name || "Użytkownik";
            const points = document.createElement("span");
            points.textContent = `${formatNumber(entry.points)} pkt`;
            row.append(rank, name, points);
            target.append(row);
        });
    }

    function renderAchievements(targetId, achievements) {
        const target = document.getElementById(targetId);
        if (!target) return;
        target.replaceChildren();
        const items = Array.isArray(achievements) ? achievements : [];
        if (!items.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Odznaki pojawią się po udziale w wyzwaniach.";
            target.append(empty);
            return;
        }
        items.forEach((achievement) => {
            const row = document.createElement("article");
            row.className = `achievement-row${achievement.unlocked ? "" : " locked"}`;
            const icon = document.createElement("span");
            icon.textContent = achievement.unlocked ? "✦" : "○";
            const copy = document.createElement("div");
            const title = document.createElement("b");
            title.textContent = achievement.title_pl || "Odznaka";
            const points = document.createElement("small");
            points.textContent = `${formatNumber(achievement.points)} pkt${achievement.unlocked ? " · zdobyta" : " · zablokowana"}`;
            copy.append(title, points);
            row.append(icon, copy);
            target.append(row);
        });
    }

    function renderCommunityPosts(snapshot, profileReady) {
        const target = document.getElementById("community-posts");
        if (!target) return;
        target.replaceChildren();
        const posts = Array.isArray(snapshot?.posts) ? snapshot.posts : [];
        setText("posts-count", formatNumber(posts.length));
        if (!posts.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = profileReady ? "Nie ma jeszcze postów widocznych dla tego konta DEV." : "Zaakceptuj zasady i wybierz pseudonim, aby dołączyć do Społeczności.";
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
            const comments = Array.isArray(post.comments) ? post.comments : [];
            const meta = document.createElement("small");
            meta.textContent = `${formatNumber(comments.length)} ${comments.length === 1 ? "komentarz" : "komentarzy"}${post.image_path ? " · zawiera zdjęcie" : ""}`;
            item.append(heading, caption, meta);
            comments.forEach((comment) => {
                const commentRow = document.createElement("div");
                commentRow.className = "community-comment";
                const commentAuthor = document.createElement("b");
                commentAuthor.textContent = comment.author_name || "Użytkownik";
                const body = document.createElement("span");
                body.textContent = comment.body || "";
                commentRow.append(commentAuthor, body);
                item.append(commentRow);
            });
            if (profileReady) {
                const form = document.createElement("form");
                form.className = "community-comment-form";
                form.dataset.communityCommentForm = post.id;
                const input = document.createElement("input");
                input.name = "body";
                input.type = "text";
                input.maxLength = 500;
                input.placeholder = "Dodaj komentarz…";
                input.required = true;
                const button = document.createElement("button");
                button.type = "submit";
                button.textContent = "Wyślij";
                form.append(input, button);
                item.append(form);
            }
            target.append(item);
        });
    }

    function renderCommunity(communitySnapshot, systemSnapshot, przemalaSnapshot, hasError) {
        currentCommunitySnapshots = { community: communitySnapshot, system: systemSnapshot, przemala: przemalaSnapshot };
        const systemPoints = finiteNumber(systemSnapshot?.total_points) ?? 0;
        const przemalaPoints = finiteNumber(przemalaSnapshot?.total_points) ?? 0;
        setText("community-points", formatNumber(systemPoints + przemalaPoints));
        const ranks = [];
        if (finiteNumber(systemSnapshot?.my_rank) !== null) ranks.push(`S#${formatNumber(systemSnapshot.my_rank)}`);
        if (finiteNumber(przemalaSnapshot?.my_rank) !== null) ranks.push(`P#${formatNumber(przemalaSnapshot.my_rank)}`);
        setText("community-rank", ranks.join(" / ") || "—");
        setText("system-challenge-points", formatNumber(systemPoints));
        setText("system-challenge-rank", finiteNumber(systemSnapshot?.my_rank) === null ? "—" : `#${formatNumber(systemSnapshot.my_rank)}`);
        setText("przemala-challenge-points", formatNumber(przemalaPoints));
        setText("przemala-challenge-rank", finiteNumber(przemalaSnapshot?.my_rank) === null ? "—" : `#${formatNumber(przemalaSnapshot.my_rank)}`);

        renderChallengeList("system-challenge-list", systemSnapshot, "system");
        renderChallengeList("przemala-challenge-list", przemalaSnapshot, "przemala");
        renderLeaderboard("leaderboard-list", [...(systemSnapshot?.leaderboard || []), ...(przemalaSnapshot?.leaderboard || []).map((entry) => ({ ...entry, rank: entry.rank, display_name: `${entry.display_name || "Użytkownik"} · P` }))]);
        renderLeaderboard("system-leaderboard-list", systemSnapshot?.leaderboard || []);
        renderLeaderboard("przemala-leaderboard-list", przemalaSnapshot?.leaderboard || []);
        renderAchievements("system-achievements-list", systemSnapshot?.achievements);
        renderAchievements("przemala-achievements-list", przemalaSnapshot?.achievements);

        const communityProfile = communitySnapshot?.profile;
        const profileReady = communityProfile?.rules_version === COMMUNITY_RULES_VERSION && communityProfile?.status === "active";
        const rulesForm = document.getElementById("community-rules-form");
        if (rulesForm) rulesForm.hidden = profileReady || communityProfile?.status === "suspended";
        const displayName = document.getElementById("community-display-name");
        if (displayName && !displayName.value && communityProfile?.display_name) displayName.value = communityProfile.display_name;
        renderCommunityPosts(communitySnapshot, profileReady);

        if (hasError) setText("community-message", "Część danych Społeczności DEV jest chwilowo niedostępna.");
        else if (communityProfile?.status === "suspended") setText("community-message", "Konto Społeczności jest wstrzymane; możesz przeglądać dostępne treści.");
        else if (!profileReady) setText("community-message", "Zaakceptuj zasady i ustaw publiczny pseudonim, aby dołączyć do rankingów i wyzwań.");
        else setText("community-message", "Zalogowano do Społeczności DEV. Wyzwania i postępy zapisują się na tym koncie.");
    }

    async function loadCommunityData(user) {
        if (!client || !user) return;
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

    async function joinCommunityChallenge(challengeId) {
        if (!challengeId || !client) return;
        if (!currentCommunitySnapshots.system?.profile_ready && !currentCommunitySnapshots.przemala?.profile_ready) {
            setText("community-message", "Najpierw zaakceptuj zasady i ustaw publiczny pseudonim w zakładce Społeczność.");
            return;
        }
        const { error } = await client.rpc("join_community_challenge", { p_challenge_id: challengeId });
        if (error) {
            setText("community-message", healthWriteError(error, "Nie udało się dołączyć do wyzwania."));
            await loadCommunityDataForActiveUser();
            return;
        }
        setText("community-message", "Dołączono do wyzwania. Odświeżam zapisane postępy…");
        await loadCommunityDataForActiveUser();
    }

    async function completeCommunityChallengeDay(challengeId, dayId) {
        if (!challengeId || !dayId || !client) return;
        const { error } = await client.rpc("complete_community_challenge_day", { p_challenge_id: challengeId, p_day_id: dayId });
        if (error) {
            setText("community-message", healthWriteError(error, "Nie udało się zapisać wykonanego dnia."));
            await loadCommunityDataForActiveUser();
            return;
        }
        setText("community-message", "Wykonany dzień zapisano. Odświeżam progres wyzwania…");
        await loadCommunityDataForActiveUser();
    }

    async function acceptCommunityRules(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const name = document.getElementById("community-display-name")?.value.trim() || "";
        const accepted = document.getElementById("community-rules-accepted")?.checked;
        const button = form.querySelector('[type="submit"]');
        if (!name || name.length < 2 || name.length > 30 || !accepted) {
            setToolStatus("community-rules-status", "Wpisz pseudonim (2–30 znaków) i zaznacz akceptację zasad.", "error");
            return;
        }
        button.disabled = true;
        setToolStatus("community-rules-status", "Zapisywanie akceptacji w DEV…");
        const { error } = await client.rpc("accept_community_rules", { p_display_name: name, p_rules_version: COMMUNITY_RULES_VERSION });
        button.disabled = false;
        if (error) {
            setToolStatus("community-rules-status", healthWriteError(error, "Nie udało się zapisać zasad Społeczności."), "error");
            return;
        }
        setToolStatus("community-rules-status", "Zasady zaakceptowane. Wczytuję Twoje wyniki…", "success");
        await loadCommunityDataForActiveUser();
    }

    async function addCommunityComment(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const postId = form.dataset.communityCommentForm;
        const body = String(new FormData(form).get("body") || "").trim();
        const button = form.querySelector("button");
        if (!postId || !body || !client) return;
        button.disabled = true;
        const { error } = await client.rpc("add_community_comment", { p_post_id: postId, p_body: body });
        if (error) {
            button.disabled = false;
            setText("community-message", healthWriteError(error, "Nie udało się dodać komentarza."));
            return;
        }
        await loadCommunityDataForActiveUser();
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
        const planColumns = "calories_target,protein_g,fat_g,carbs_g,estimated_tdee,estimated_rmr,diet_type,status,version";

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
                .eq("user_id", user.id).order("summary_date", { ascending: false }).limit(30),
            client.rpc("get_today_meals"),
            client.rpc("get_current_meal_plan"),
            client.from("user_privacy_consents").select("explicit_health_data_consent,consented_at")
                .eq("user_id", user.id).eq("policy_version", CURRENT_PRIVACY_POLICY_VERSION)
                .eq("explicit_health_data_consent", true).limit(1).maybeSingle(),
            client.from("body_measurements").select("measurement_date,waist_cm,hips_cm,chest_cm,arm_cm,thigh_cm,measured_at")
                .eq("user_id", user.id).order("measurement_date", { ascending: false }).limit(30),
            client.from("user_event_goals").select("event_name,event_date,updated_at")
                .eq("user_id", user.id).limit(1).maybeSingle(),
            client.from("safety_profiles").select("pregnant,breastfeeding,eating_disorder_risk,uses_hypoglycemia_medication,uses_sglt2_inhibitor,confirmed_at")
                .eq("user_id", user.id).limit(1).maybeSingle(),
            client.rpc("get_meal_preferences"),
            client.rpc("get_meal_preference_catalog"),
            client.rpc("get_premium_snapshot")
        ]);

        if (sequence !== dataLoadSequence || user.id !== activeUserId) return;

        const bodyMeasurements = bodyResult.error
            ? []
            : Array.isArray(bodyResult.data)
                ? bodyResult.data
                : bodyResult.data ? [bodyResult.data] : [];
        const latestBodyMeasurement = bodyMeasurements[0] || null;

        currentProgressData = {
            profile: profileResult.error ? null : profileResult.data,
            dashboard: dashboardResult.error ? null : dashboardResult.data,
            weekly: weeklyResult.error ? null : weeklyResult.data,
            weights: weightResult.error ? [] : (Array.isArray(weightResult.data) ? weightResult.data : []),
            daily: stepsResult.error ? [] : (Array.isArray(stepsResult.data) ? stepsResult.data : []),
            measurements: bodyMeasurements,
            event: eventResult.error ? null : eventResult.data
        };

        currentNutritionPlan = planResult.error ? null : planResult.data;
        currentPremiumSnapshot = premiumResult.error ? null : premiumResult.data;
        premiumSnapshotUnavailable = Boolean(premiumResult.error);
        updateFridgeQuota();

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
        renderBodyMeasurement(latestBodyMeasurement, bodyResult.error);
        renderEventGoal(eventResult.error ? null : eventResult.data, profileResult.error ? null : profileResult.data, eventResult.error);
        renderBodyMeasurementHistory(bodyMeasurements, bodyResult.error);
        renderProgressHub(
            dashboardResult.error ? null : dashboardResult.data,
            weeklyResult.error ? null : weeklyResult.data,
            stepsResult.error ? [] : stepsResult.data,
            latestBodyMeasurement,
            eventResult.error ? null : eventResult.data,
            currentPremiumSnapshot
        );
        if (activeProgressDestination) renderProgressDestination(activeProgressDestination);
        else setProgressSection(activeProgressSection);
        renderProfileAccess(
            currentPremiumSnapshot,
            dashboardResult.error ? null : dashboardResult.data,
            planResult.error ? null : planResult.data
        );
        if (currentPremiumSnapshot?.coach_memory_view_allowed === true) {
            void loadProfileCoachMemories(user.id, sequence);
        } else {
            const memoryMessage = premiumSnapshotUnavailable
                ? "Nie udało się sprawdzić dostępu do pamięci DEV."
                : "Potwierdzanie pamięci Coacha jest dostępne w pakiecie PRO w aplikacji Android.";
            renderCoachMemories([], memoryMessage);
        }
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
        void loadCommunityData(user);
    }

    function renderUser(user) {
        const name = userDisplayName(user);
        const email = user.email || "Konto DEV";
        const letter = avatarLetter(name);
        setText("welcome-name", name);
        document.getElementById("sidebar-user-name").textContent = name;
        document.getElementById("sidebar-user-email").textContent = email;
        document.getElementById("sidebar-avatar").textContent = letter;
        document.getElementById("profile-email").textContent = email;
    }

    function showSignedOut(message = "Połączenie wyłącznie z projektem DEV", kind = "neutral") {
        dataLoadSequence += 1;
        activeUserId = null;
        profileResetBusy = false;
        if (profileResetModal) profileResetModal.hidden = true;
        document.body.classList.remove("modal-open");
        if (profileResetResult) profileResetResult.textContent = "";
        activeProgressSection = "hub";
        activeProgressDestination = null;
        currentProgressData = { profile: null, daily: [], weights: [], measurements: [], event: null };
        currentCommunitySnapshots = { community: null, system: null, przemala: null };
        challengeDaySelection.clear();
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
        const requestedRoute = route === "community" ? "progress" : route;
        if (route === "community") setProgressSection("community");
        const safeRoute = Object.hasOwn(routeLabels, requestedRoute) ? requestedRoute : "home";
        appShell?.classList.toggle("home-route-active", safeRoute === "home");
        appShell?.classList.toggle("meals-route-active", safeRoute === "meals");
        appShell?.classList.toggle("fridge-route-active", safeRoute === "fridge");
        appShell?.classList.toggle("progress-route-active", safeRoute === "progress");
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
        window.scrollTo({ top: 0, behavior: "auto" });
        document.querySelector(".app-workspace")?.scrollTo({ top: 0, behavior: "auto" });
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
            setFridgeStatus("Zaloguj się ponownie, aby użyć Lodówki DEV.", true);
            return;
        }
        if (products.length < 3 || products.length > 2000) {
            setFridgeStatus("Podaj produkty i ilości (od 3 do 2000 znaków).", true);
            fridgeProducts?.focus();
            return;
        }
        void generateFridgeProposal(products);
    });
    fridgeProducts?.addEventListener("input", () => {
        if (fridgeGenerateButton) fridgeGenerateButton.disabled = fridgeActionBusy || fridgeProducts.value.trim().length < 3;
        if (fridgeProducts.value.trim().length >= 3) setFridgeStatus("");
    });
    document.querySelectorAll("[data-fridge-mode]").forEach((button) => {
        button.addEventListener("click", () => setFridgeMode(button.dataset.fridgeMode));
    });
    fridgeCustomCalories?.addEventListener("input", () => updateFridgeTargetCard());
    fridgeResetButton?.addEventListener("click", () => {
        if (fridgeProducts) fridgeProducts.value = "";
        if (fridgeGenerateButton) fridgeGenerateButton.disabled = true;
        if (fridgeCustomCalories) fridgeCustomCalories.value = "";
        currentFridgeProposal = null;
        currentFridgeProducts = "";
        if (fridgeEmptyState) fridgeEmptyState.hidden = false;
        document.getElementById("fridge-result")?.setAttribute("hidden", "");
        setFridgeMode("remaining", { focus: false });
        setFridgeStatus("Gotowe do wygenerowania.");
        fridgeProducts?.focus();
    });
    fridgeAddTodayButton?.addEventListener("click", () => void commitFridgeProposal());
    fridgeRegenerateButton?.addEventListener("click", () => {
        const products = currentFridgeProducts || fridgeProducts?.value.trim() || "";
        if (products.length >= 3) void generateFridgeProposal(products, { regenerate: true });
    });
    fridgeChangeProductsButton?.addEventListener("click", () => {
        currentFridgeProposal = null;
        if (fridgeEmptyState) fridgeEmptyState.hidden = false;
        document.getElementById("fridge-result")?.setAttribute("hidden", "");
        setFridgeStatus("");
        fridgeProducts?.focus();
    });
    fridgeReportButton?.addEventListener("click", () => void reportFridgeProposal());

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
    coachHistoryButton?.addEventListener("click", () => {
        if (activeUserId) void loadCoachHistory({ id: activeUserId });
    });
    document.querySelectorAll("[data-coach-section]").forEach((button) => {
        button.addEventListener("click", () => {
            const isCoach = button.dataset.coachSection === "coach";
            document.querySelectorAll("[data-coach-section]").forEach((item) => {
                const selected = item === button;
                item.classList.toggle("active", selected);
                item.setAttribute("aria-selected", String(selected));
            });
            if (!isCoach) setText("coach-status", "Czat z Przemalą pozostaje w aplikacji Android DEV. AI Coach działa tutaj.");
        });
    });

    healthConsentCheckbox?.addEventListener("change", () => {
        healthConsentButton.disabled = !healthConsentCheckbox.checked;
        setToolStatus("health-consent-status", "");
    });
    healthConsentButton?.addEventListener("click", () => void recordHealthConsent());
    progressHealthConsentCheckbox?.addEventListener("change", () => {
        progressHealthConsentButton.disabled = !progressHealthConsentCheckbox.checked;
        setToolStatus("progress-health-consent-status", "");
    });
    progressHealthConsentButton?.addEventListener("click", () => void recordHealthConsent(
        progressHealthConsentCheckbox,
        progressHealthConsentButton,
        "progress-health-consent-status"
    ));

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
    document.querySelectorAll("[data-progress-open]").forEach((button) => {
        button.addEventListener("click", () => openProgressDestination(button.dataset.progressOpen));
    });
    document.querySelectorAll("[data-progress-section-button]").forEach((button) => {
        button.addEventListener("click", () => setProgressSection(button.dataset.progressSectionButton));
    });
    document.getElementById("progress-detail-back")?.addEventListener("click", () => setProgressSection(activeProgressSection));
    progressDetailEntryForm?.addEventListener("submit", (event) => void saveProgressEntry(event));
    progressDetailEntryForm?.addEventListener("click", (event) => {
        if (event.target.closest("[data-progress-event-delete]")) void deleteProgressEvent();
    });
    document.querySelectorAll("[data-challenge-view]").forEach((button) => {
        button.addEventListener("click", () => challengeTab(button.dataset.challengeView));
    });
    document.addEventListener("click", (event) => {
        const join = event.target.closest("[data-challenge-join]");
        if (join) {
            join.disabled = true;
            void joinCommunityChallenge(join.dataset.challengeJoin);
            return;
        }
        const complete = event.target.closest("[data-challenge-complete]");
        if (complete) {
            complete.disabled = true;
            void completeCommunityChallengeDay(complete.dataset.challengeComplete, complete.dataset.dayId);
            return;
        }
        const day = event.target.closest("[data-challenge-day-select]");
        if (day) {
            const challengeId = day.dataset.challengeDaySelect;
            challengeDaySelection.set(challengeId, Number(day.dataset.dayNumber));
            const origin = day.closest("#przemala-challenge-list") ? "przemala" : "system";
            renderChallengeList(origin === "przemala" ? "przemala-challenge-list" : "system-challenge-list", currentCommunitySnapshots[origin], origin);
        }
    });
    document.getElementById("community-rules-form")?.addEventListener("submit", (event) => void acceptCommunityRules(event));
    document.addEventListener("submit", (event) => {
        const form = event.target.closest("[data-community-comment-form]");
        if (form) void addCommunityComment(event);
    });
    document.getElementById("progress-share-report")?.addEventListener("click", () => void shareWeeklyProgressReport());
    document.getElementById("profile-memory-list")?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-memory-action]");
        if (!button || button.disabled) return;
        void reviewProfileCoachMemory(button.dataset.memoryId, button.dataset.memoryAction);
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

    document.querySelectorAll("[data-meals-view]").forEach((button) => {
        button.addEventListener("click", () => setMealsView(button.dataset.mealsView));
    });
    document.querySelectorAll("[data-open-meals-diary]").forEach((button) => {
        button.addEventListener("click", () => setMealsView("diary"));
    });
    document.querySelectorAll("[data-meal-type]").forEach((button) => {
        button.addEventListener("click", () => {
            selectedManualMealType = button.dataset.mealType || "breakfast";
            document.querySelectorAll("[data-meal-type]").forEach((item) => {
                const selected = item === button;
                item.classList.toggle("active", selected);
                item.setAttribute("aria-checked", String(selected));
            });
        });
    });
    mealGramsForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const grams = finiteNumber(mealGramsValue?.value);
        if (!selectedFoodForGrams || grams === null || grams < 1 || grams > 5000) {
            setText("meal-grams-status", "Podaj ilość od 1 do 5000 g.");
            mealGramsValue?.focus();
            return;
        }
        mealDraftItems = [...mealDraftItems, { food: selectedFoodForGrams, grams }];
        closeMealGrams();
        renderMealDraft();
        setToolStatus("meal-draft-status", "Produkt dodany. Możesz dodać kolejny lub zapisać posiłek.", "success");
    });
    cancelMealGramsButton?.addEventListener("click", closeMealGrams);
    mealGramsModal?.addEventListener("click", (event) => {
        if (event.target === mealGramsModal) closeMealGrams();
    });
    saveMealDraftButton?.addEventListener("click", () => void saveMealDraft());
    closeFoodDayButton?.addEventListener("click", () => void closeTodayFoodDay());

    document.querySelectorAll("[data-coach-prompt]").forEach((button) => {
        button.addEventListener("click", () => {
            if (!coachInput) return;
            const prompt = button.dataset.coachPrompt || "";
            if (!client || !activeUserId || !prompt) {
                coachInput.value = prompt;
                coachInput.focus();
                return;
            }
            void sendCoachMessage(prompt);
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
        if (event.key === "Escape" && !mealGramsModal?.hidden) {
            closeMealGrams();
            return;
        }
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
