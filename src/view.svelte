<script lang="ts">
    import { sdata, sname } from "./stores.ts";
    import { onMount } from "svelte";
    let hide = true;
    let data;
    sdata.subscribe(d => data = d);
    let name;
    sname.subscribe(d => name = d);
    let textarea;
    onMount(() => {
        // HOLY SHIT I AM A GENIUS
        // prevent default tab action and insert 4 spaces + move cursor
        textarea.addEventListener('keydown', function (e) {
            if (e.which == 9) {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;

                let spaces = "    ";
                this.value = this.value.substring(0, start) + spaces + this.value.substring(end);

                // move cursor
                this.selectionStart = this.selectionEnd = start + spaces.length;
            }
        });
    });
</script>

<main>
    <div class="checktoggle column">
        <div>
            <input class="checksize" type="checkbox" bind:checked={hide}>
            <br />
            <button on:click={() => localStorage.clear()}>
                <div class="buttonlabel">
                    Clear LS
                </div>
            </button>
        </div>
        <a href="https://github.com/notseanray/liveview" target="_blank">
            <img class="githublogo" src="/github.webp" alt="" />
        </a>
    </div>
    <div>
        <iframe
            class={hide ? "iframedatasplit" : "iframedata"}
            frameBorder="0"
            src={`data:text/html;charset=utf-8,${escape(data)}`}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-storage-access-by-user-activation"
        />
        {#if hide}
            <textarea
                spellcheck="false"
                bind:this={textarea}
                class="controls"
                on:keyup={() => {
                sdata.set(data);
            }} bind:value={data} />
        {/if}
    </div>
</main>

<style>
    main {
        color: white;
        overflow-x: hidden;
    }
    .buttonlabel {
        color: #d8dee9;
    }
    .githublogo {
        margin-left: 20px;
        margin-top: 10px;
        height: 32px;
    }
    .checktoggle {
        display: flex;
        margin-left: 90vw;
        top: -15px;
        z-index: 10;
        position: absolute;
    }
    .checksize {
        height: 20px;
        width: 20px;
    }
    .iframedatasplit {
        min-width: 50vw;
        width: auto-fill;
        height: 100vh;
        color: #d8dee9;
        background: #3b4252;
    }
    .iframedata {
        width: 98%;
        height: 100vh;
        color: #d8dee9;
        background: #3b4252;
    }

    .controls {
        background-color: #3b4252;
        color: white;
        width: 48vw;
        height: 100vh;
    }

    * {
      box-sizing: border-box;
    }

    /* Create two equal columns that floats next to each other */
    .column {
      float: left;
      width: 50%;
      padding: 10px;
    }

    /* Clear floats after the columns */
    .row:after {
      content: "";
      display: table;
      clear: both;
    }
</style>
