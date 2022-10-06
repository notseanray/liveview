import {writable} from "svelte/store";
export const sdata = writable("");
export const sname = writable("home");
export const hide = writable(true);
export const tabs = writable(
    [ {name : "home", data : "<!-- html goes here! -->", hide : false} ]);

export const rerender_monaco = () => {
  let hidden: boolean;
  hide.subscribe(d => hidden = d);
  if (hidden) {
    hide.set(!hidden);
    const restore = setInterval(() => {
      hide.set(!hidden);
      clearInterval(restore);
    }, 5);
  }
};
