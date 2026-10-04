(() => {
    "use strict";

    const REQUIRED_PROJECT_REF = "iqqiizsehdjwenqowsqc";
    const config = window.PROJECT_WEIGHT_DROP_WEB_CONFIG;
    const authView = document.getElementById("auth-view");
    const appView = document.getElementById("app-view");
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

    const numberFormatter = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });
    const weightFormatter = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

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
            "home-weight-progress", "home-weight-detail", "profile-onboarding", "profile-diet",
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
    }

    function friendlyDataError(error) {
        const message = String(error?.message || error?.details || "").toLowerCase();
        if (message.includes("profile_not_found")) return "Najpierw dokończ profil w aplikacji DEV na Androidzie.";
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

    function featureErrorMessage(code, feature) {
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
            premium_state_unavailable: "Nie udało się sprawdzić dostępu do AI Coacha.",
            coach_context_unavailable: "Dane potrzebne Coachowi są chwilowo niedostępne.",
            coach_meal_context_unavailable: "Dziennik posiłków jest chwilowo niedostępny dla Coacha.",
            ai_service_error: "Usługa AI DEV nie odpowiedziała poprawnie. Spróbuj ponownie.",
            invalid_message: "Wiadomość jest pusta albo zbyt długa."
        };
        return messages[code] || `Nie udało się uruchomić funkcji ${feature} w DEV.`;
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
        const caloriesTarget = finiteNumber(data?.calories_target);
        const caloriesConsumed = finiteNumber(data?.calories_consumed) ?? 0;
        const remaining = caloriesTarget === null ? null : Math.max(0, caloriesTarget - caloriesConsumed);
        setText("home-calories-remaining", formatNumber(remaining));
        setText("home-calories-detail", caloriesTarget === null
            ? "Brak aktywnego celu kalorii"
            : `${formatNumber(caloriesConsumed)} / ${formatNumber(caloriesTarget)} kcal wykorzystane`);
        setProgress("home-calories-bar", caloriesConsumed, caloriesTarget);

        setText("home-current-weight", formatWeight(data?.current_weight_kg));
        setText("home-goal-weight", formatWeight(data?.goal_weight_kg));
        setText("home-water", formatNumber(data?.water_ml));
        setText("home-steps", formatNumber(data?.steps));

        const macroRows = [
            ["protein", data?.protein_consumed, data?.protein_target],
            ["fat", data?.fat_consumed, data?.fat_target],
            ["carbs", data?.carbs_consumed, data?.carbs_target]
        ];
        macroRows.forEach(([name, consumed, target]) => {
            setText(`home-${name}`, `${formatNumber(consumed)} / ${formatNumber(target)} g`);
            setProgress(`home-${name}-bar`, consumed, target);
        });

        const weightProgress = finiteNumber(data?.goal_progress_percent);
        setText("home-weight-progress", weightProgress === null ? "—" : `${formatNumber(weightProgress)}%`);
        setProgress("home-weight-progress-bar", weightProgress, 100);
        const change = finiteNumber(data?.change_from_start_kg);
        const average = finiteNumber(data?.average_7d);
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

    function renderProfile(profile, plan) {
        if (!profile) {
            profileDataPanel?.setAttribute("aria-busy", "false");
            setText("profile-data-message", "Brak profilu. Dokończ konfigurację w aplikacji DEV na Androidzie.");
            setText("home-profile-status", "Brak profilu");
            setText("home-profile-detail", "Wymagane dokończenie konfiguracji DEV");
            setStatusCard("profile-status-card", "error");
            return;
        }

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
            ? `${formatDiet(plan.diet_type)} · ${formatNumber(plan.calories_target)} kcal`
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
        const day = currentMealPlan?.days?.find((entry) => Number(entry.day_index) === dayIndex);
        if (!day) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = `Dzień ${dayIndex + 1} nie został jeszcze wygenerowany.`;
            list.append(empty);
            return;
        }
        (Array.isArray(day.meals) ? day.meals : []).forEach((meal) => {
            const card = document.createElement("article");
            card.className = "meal-plan-card";
            const copy = document.createElement("div");
            const title = document.createElement("h4");
            const detail = document.createElement("p");
            const kcal = document.createElement("span");
            title.textContent = `${formatMealType(meal.meal_type)} · ${meal.title || "Posiłek"}`;
            const ingredients = (Array.isArray(meal.ingredients) ? meal.ingredients : []).map((item) => item.food_name).join(", ");
            detail.textContent = `${ingredients || "Brak listy składników"} · B ${formatNumber(meal.protein_g)} g · T ${formatNumber(meal.fat_g)} g · W ${formatNumber(meal.carbs_g)} g`;
            kcal.textContent = `${formatNumber(meal.calories)} kcal`;
            copy.append(title, detail);
            card.append(copy, kcal);
            list.append(card);
        });
        if (!list.children.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Ten dzień nie zawiera posiłków.";
            list.append(empty);
        }
    }

    function renderMealPlan(plan) {
        currentMealPlan = plan && Array.isArray(plan.days) ? plan : null;
        const tabs = document.getElementById("meal-day-tabs");
        const list = document.getElementById("meal-plan-list");
        if (!tabs || !list) return;
        tabs.replaceChildren();
        if (!currentMealPlan) {
            list.replaceChildren();
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "Brak aktywnego planu posiłków. Plan PRO można przygotować w aplikacji DEV na Androidzie.";
            list.append(empty);
            setText("meal-plan-message", "Brak planu dostępnego dla tego konta DEV.");
            return;
        }
        for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.dayIndex = String(dayIndex);
            button.setAttribute("role", "tab");
            button.textContent = String(dayIndex + 1);
            button.addEventListener("click", () => renderMealPlanDay(dayIndex));
            tabs.append(button);
        }
        const firstGeneratedDay = currentMealPlan.days.find((day) => Array.isArray(day.meals) && day.meals.length)?.day_index;
        renderMealPlanDay(Number.isFinite(Number(firstGeneratedDay)) ? Number(firstGeneratedDay) : 0);
        setText("meal-plan-message", `${formatDiet(currentMealPlan.diet_type)} · ${formatNumber(currentMealPlan.calories_target)} kcal · tydzień od ${formatDate(currentMealPlan.week_start)}`);
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
            "timezone", "goal_type", "onboarding_completed"
        ].join(",");
        const planColumns = "calories_target,protein_g,fat_g,carbs_g,diet_type,status,version";

        const [dashboardResult, profileResult, planResult, weeklyResult, weightResult, stepsResult, todayMealsResult, mealPlanResult] = await Promise.all([
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
            client.rpc("get_current_meal_plan")
        ]);

        if (sequence !== dataLoadSequence || user.id !== activeUserId) return;

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
    }

    function renderUser(user) {
        const name = userDisplayName(user);
        const email = user.email || "Konto DEV";
        const letter = avatarLetter(name);
        document.getElementById("welcome-name").textContent = name;
        document.getElementById("sidebar-user-name").textContent = name;
        document.getElementById("sidebar-user-email").textContent = email;
        document.getElementById("sidebar-avatar").textContent = letter;
        document.getElementById("profile-avatar").textContent = letter;
        document.getElementById("profile-email").textContent = email;
    }

    function showSignedOut(message = "Połączenie wyłącznie z projektem DEV", kind = "neutral") {
        dataLoadSequence += 1;
        activeUserId = null;
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
        document.querySelectorAll("[data-sign-out]").forEach((button) => { button.disabled = true; });
        const { error } = await client.auth.signOut();
        document.querySelectorAll("[data-sign-out]").forEach((button) => { button.disabled = false; });
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
    window.addEventListener("hashchange", () => {
        if (!appView.hidden) navigateTo(window.location.hash.slice(1), false);
    });

    void initializeAuth();
})();
