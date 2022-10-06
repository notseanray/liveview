<script lang="ts">
    import View from "./view.svelte";
    import { sdata, sname, tabs, hide, rerender_monaco } from "./stores.ts";
    import Clipboard from "svelte-clipboard";
    const datap = localStorage.getItem("data");
    let ttabs = [];
    let chide;
    let cname;
    let pastev;
    const lsdata = localStorage.getItem("data");
    const ndata = localStorage.getItem("selected");
    if (lsdata) {
        try {
            const d = JSON.parse(lsdata);
            const s = JSON.parse(ndata)
            const sel = s ? s : "home";
            ttabs = d;
            // why does this even work?
            const restore = setInterval(() => {
                tabs.set(d);
                let check = false;
                let newdata;
                for (const t of d) {
                    if (t.name == sel) {
                        check = true;
                        newdata = t.data;
                    }
                }
                if (check && newdata) {
                    cname = sel;
                    sname.set(sel);
                    cdata = newdata;
                    sdata.set(newdata);
                    name = "new";
                }
                clearInterval(restore);
            }, 5);
        } catch {
            console.log("failed to restore data from LS, resetting data")
            localStorage.clear();
        }
    }
    tabs.subscribe(d => {
        ttabs = d;
        if (d.length > 0) {
            localStorage.setItem("data", JSON.stringify(d));
        }
    });
    let name = "about";

    sname.subscribe(d => cname = d);
    let cdata;
    sdata.subscribe(d => {
        let newtabs = [];
        for (let t of ttabs) {
            if (t.name == cname) {
                newtabs.push({ hide: t.hide, name: t.name, data: d});
            } else {
                newtabs.push(t);
            }
        }
        tabs.set(newtabs);
        cdata = d
    });
</script>

<main>
    <div class="tabbar">
        <div>
            <div class="flexout">
                <div class="tabdisplay">
                    GIGA EDITOR 9000 (BY SEAN!!)<br />
                    SELECTED: {cname}
                </div>
                <div>
                    <Clipboard
                        text={JSON.stringify(ttabs)}
                        let:copy
                        on:copy={() => {
                            console.log("copied to clipboard");
                        }}>
                        <button on:click={copy}>
                            <div class="buttonlabel">
                                COPY TO CLIPBOARD
                            </div>
                        </button>
                    </Clipboard>
                    <input bind:value={pastev} >
                    <button on:click={() => {
                        try {
                            if (pastev) {
                                const pd = JSON.parse(pastev);
                                if (pd.length > 0) {
                                    ttabs = pd;
                                    tabs.set(pd);
                                    const restore = setInterval(() => {
                                        const f = pd[0];
                                        cname = f.name;
                                        sname.set(f.name);
                                        cdata = f.data;
                                        sdata.set(f.data);
                                        rerender_monaco();
                                        clearInterval(restore);
                                    }, 5);
                                }
                            }
                        } catch {
                            console.log("failed to parse")
                        }
                    }}>
                        <div class="buttonlabel">
                            LOAD
                        </div>
                    </button>
                </div>
            </div>
        </div>
        {#each ttabs as tab}
            <div class="tabname">
                <button on:click={() => {
                    let newtabs = [];
                    for (const t of ttabs) {
                        if (t.name == tab.name) {
                            continue;
                        }
                        newtabs.push(t);
                    }
                    if (newtabs.length == 0) {
                        cname = "none";
                    }
                    tabs.set(newtabs);
                }}>
                <div class="buttonlabel">
                    {tab.name}
                </div>
                </button>
                <button on:click={() => {
                    for (let i = 0; i < ttabs.length; i++) {
                        if (ttabs[i].name == tab.name) {
                            let current = ttabs[i];
                            cname = current.name;
                            cdata = current.data;
                            sdata.set(current.data);
                            sname.set(current.name);
                            rerender_monaco();
                            localStorage.setItem("selected", JSON.stringify(cname));
                        }
                    }
                }}>
                <div class="buttonlabel">
                    select
                </div>
                </button>
            </div>
        {/each}
        <input class="tabinput" bind:value={name}>
        <button class="tabinputplus" on:click={() => {
            let disabled = false;
            for (const t of ttabs) {
                if (t.name == name) {
                    disabled = true;
                }
            }
            if (!disabled) {
                tabs.set([...ttabs, { hide: false, data: "", name: name}]);
            }
            cname = name;
            cdata = "";
            sdata.set("");
            rerender_monaco();
        }}>
            <div class="buttonlabel">
                +
            </div>
        </button>
    </div>
    {#if ttabs.length > 0}
        <View name={cname} init={true} />
    {/if}
</main>

<style>
    .tabinput {
        margin-top: 4px;
        height: 15px;
    }
    .flexout {
        display: flex;
    }
    .tabinputplus {
        margin-top: 4px;
        height: 22px;
    }
    .tabbar {
        display: flex;
        color: #d8dee9;
    }
    .tabdisplay {
        width: 300px;
    }
    .tabname {
        margin-left: 20px;
        margin-right: 20px;
    }
    .buttonlabel {
        color: #d8dee9;
    }
</style>
