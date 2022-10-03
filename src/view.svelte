<script lang="ts">
    import { sdata, sname, hide } from "./stores.ts";
    import { onMount, onDestroy } from "svelte";
    import { writable } from "svelte/store";
    import type monaco from 'monaco-editor';
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    let data;
    sdata.subscribe(d => data = d);
    let name;
    const debounce = (fn, interval) => {
        let timer;
        return function debounced(...args) {
            clearTimeout(timer);
            timer = setTimeout(function call() {
                fn(...args);
            }, interval);
        };
    };
    onDestroy(() => {
        window.removeEventListener("resize", debounce(handleResize, 100));
    })
    let init;
    sname.subscribe(d => name = d);
    let divEl: HTMLDivElement = null;
    let editor: monaco.editor.IStandaloneCodeEditor;
        const loadEditor = async () => {
            let Monaco;
            Monaco = await import('monaco-editor');
            // @ts-ignore
            self.MonacoEnvironment = {
                getWorker: function (_moduleId: any, label: string) {
                    // if (label === 'json') {
                    // 	return new jsonWorker();
                    // }
                    // if (label === 'css' || label === 'scss' || label === 'less') {
                    // 	return new cssWorker();
                    // }
                    if (label === 'html' || label === 'handlebars' || label === 'razor') {
                    	return new htmlWorker();
                    }
                    // if (label === 'typescript' || label === 'javascript') {
                    // 	return new tsWorker();
                    // }
                    return new editorWorker();
                }
            };
            editor = Monaco.editor.create(divEl, {
                value: data,
                language: 'html',
                theme: "vs-dark",
                hideCursorInOverviewRuler: true,
                overviewRulerBorder: false,
                wordWrap: 'on',
                minimap: {
                    enabled: false
                }
            });
            editor.onDidChangeModelContent(() => {
                const v = editor.getValue({ lineEnding: '\n', preserveBOM: true });
                let data;
                sdata.subscribe(d => data = d);
                localStorage.setItem("data", JSON.stringify(data));
                sdata.set(v);
                value.set(v);
            });

            return () => {
                editor.dispose();
            };
        }
    onMount(async () => {
        window.addEventListener("resize", debounce(handleResize, 100));
        // only for text area
        // prevent default tab action and insert 4 spaces + move cursor
        // textarea.addEventListener('keydown', function (e) {
        //     if (e.which == 9) {
        //         e.preventDefault();
        //         const start = this.selectionStart;
        //         const end = this.selectionEnd;
        //
        //         let spaces = "    ";
        //         this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
        //
        //         // move cursor
        //         this.selectionStart = this.selectionEnd = start + spaces.length;
        //     }
        // });

        await loadEditor();
        init = true;
    });
    hide.subscribe(v => {
        if (v && init) {
            loadEditor().then(() => {})
        }
    });
    const handleResize = (e) => {
        let hidden;
        hide.subscribe(v => hidden = v);
        if (init) {
            const restore = setInterval(() => {
                hide.set(hidden);
                hide.set(!hidden);
                clearInterval(restore);
            }, 100);
        }
    }
</script>

<main>
    <div class="checktoggle column">
        <div>
            <input class="checksize" type="checkbox" bind:checked={$hide}>
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
    <div class="together">
        <iframe
            class={$hide ? "iframedatasplit" : "iframedata"}
            frameBorder="0"
            src={`data:text/html;charset=utf-8,${escape(data)}`}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-storage-access-by-user-activation"
        />
        {#if $hide}
            <!-- <textarea -->
            <!--     spellcheck="false" -->
            <!--     bind:this={textarea} -->
            <!--     class="controls" -->
            <!--     on:keyup={() => { -->
            <!--     sdata.set(data); -->
            <!-- }} bind:value={data} /> -->
            <div class="controls" bind:this={divEl} />
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
    .together {
        display: flex;
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
        background: #3b4252;
        color: #3b4252;
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
