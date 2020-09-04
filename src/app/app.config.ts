import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface AppConfig {
	appName: string;
	appDisplayName: string;
	dummyUserProfileImage: string;
	apiBase: string;
	apiServerName: string;
}

export const BaseAppConfig: AppConfig = {
	appName: "TradingClient",
	appDisplayName: "Trading Client",
	dummyUserProfileImage: "assets/img/dummy_user.png",
	apiBase: "http://localhost:8080/api/v1",
	apiServerName: "http://localhost:8080/"

};
