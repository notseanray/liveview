import { writable } from "svelte/store";
export const sdata = writable("");
export const sname = writable("home");
export const tabs = writable([{name: "home", data: "<!-- html goes here! -->", hide: false}]);
