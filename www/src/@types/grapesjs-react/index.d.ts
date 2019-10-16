// Type definitions for grapesjs 0.14.52
// Project: https://github.com/artf/grapesjs/
// Definitions by: Patrick Spiegel <https://github.com/Rottohawkins>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

/// <reference types="backbone" />
/// <reference types="cash" />
/// <reference types="node" />

import { Collection, Model } from "backbone";

declare class GrapesEditor {
  private constructor();
  static init(config?: grapesjs.EditorConfig | object): grapesjs.Editor;
}

declare namespace grapesjs {
  interface Editor {
    $: Function;
    editor: object;
    DomComponents: object;
    LayerManager: object;
    CssComposer: object;
    StorageManager: object;
    AssetManager: AssetManager;
    BlockManager: BlockManager;
    TraitManager: object;
    SelectorManager: SelectorManager;
    CodeManager: object;
    Commands: Collection<Model>;
    Keymaps: object;
    Modal: Modal;
    Panels: Collection<Model>;
    StyleManager: object;
    Canvas: Canvas;
    UndoManager: object;
    DeviceManager: object;
    RichTextEditor: object;
    Parser: object;
    Utils: object;
    Config: EditorConfig | object;

    getConfig(prop: string): EditorConfig | object;
    getHtml(opts: any): string;
    getCss(opts: any): string;
    getJs(opts: any): string;
    getComponents(): Array<object>;
    getWrapper(): object;
    setComponents(components: Array<object>): Editor;
    addComponents(components: Array<object>): Array<object>;
    getStyle(): object;
    setStyle(style: Array<object> | object | string): Editor;
    getSelected(): Array<Selection>;
    getSelectedAll(): Array<Selection>;
    getSelectedToStyle(): object | undefined;
    select(el: object | HTMLElement): Editor;
    selectAdd(
      el: object | HTMLElement | Array<object> | Array<HTMLElement>
    ): Editor;
    selectRemove(
      el: object | HTMLElement | Array<object> | Array<HTMLElement>
    ): Editor;
    selectToggle(
      el: object | HTMLElement | Array<object> | Array<HTMLElement>
    ): Editor;
    setDevice(name: string): Editor;
    getDevice(): object;
    runCommand(id: string, options: object): any;
    stopCommand(id: string, options: object): any;
    store(clb: Function): object;
    load(clb: Function): object;
    getContainer(): HTMLElement;
    getDirtyCount(): number;
    refresh(): void;
    setCustomRte(obj: object): void;
    setCustomParserCss(parser: Function | null): Editor;
    log(msg: any, opts?: LogOptions): Editor;
    on(event: GrapesEvent, callback: Function): Editor;
    on(event: string, callback: Function): Editor;
    once(event: GrapesEvent, callback: Function): Editor;
    once(event: string, callback: Function): Editor;
    off(event: GrapesEvent, callback: Function): Editor;
    off(event: string, callback: Function): Editor;
    trigger(event: GrapesEvent, ...params: any): Editor;
    trigger(event: string, ...params: any): Editor;
    destroy(): void;
    getEl(): HTMLElement;
    getModel(): object;
    render(): HTMLElement;
  }

  type GrapesEvent =
    | ComponentEvent
    | BlockEvent
    | AssetEvent
    | KeymapEvent
    | StyleManagerEvent
    | StorageEvent
    | CanvasEvent
    | SelectorEvent
    | RichTextEditorEvent
    | ModalEvent
    | CommandEvent
    | GeneralEvent;

  type ComponentEvent =
    | "component:create"
    | "component:mount"
    | "component:add"
    | "component:remove"
    | "component:clone"
    | "component:update"
    | "component:update:{propertyName}"
    | "component:styleUpdate"
    | "component:styleUpdate:{propertyName}"
    | "component:selected"
    | "component:deselected"
    | "component:toggled";

  type BlockEvent =
    | "block:add"
    | "block:remove"
    | "block:drag:start"
    | "block:drag"
    | "block:drag:stop";

  type AssetEvent =
    | "asset:add"
    | "asset:remove"
    | "asset:upload:start"
    | "asset:upload:end"
    | "asset:upload:error"
    | "asset:upload:response";

  type KeymapEvent =
    | "keymap:add"
    | "keymap:remove"
    | "keymap:emit"
    | "keymap:emit:{keymapId}";

  type StyleManagerEvent =
    | "styleManager:update:target"
    | "styleManager:change"
    | "styleManager:change:{propertyName}";

  type StorageEvent =
    | "storage:start"
    | "storage:start:store"
    | "storage:start:load"
    | "storage:load"
    | "storage:store"
    | "storage:end"
    | "storage:end:store"
    | "storage:end:load"
    | "storage:error"
    | "storage:error:store"
    | "storage:error:load";

  type CanvasEvent =
    | "canvas:dragenter"
    | "canvas:dragover"
    | "canvas:drop"
    | "canvas:dragend"
    | "canvas:dragdata";

  type SelectorEvent = "selector:add";

  type RichTextEditorEvent = "rte:enable" | "rte:disable";

  type ModalEvent = "modal:open" | "modal:close";

  type CommandEvent =
    | "run:{commandName}"
    | "stop:{commandName}"
    | "run:{commandName}:before"
    | "stop:{commandName}:before"
    | "abort:{commandName}";

  type GeneralEvent = "canvasScroll" | "undo" | "redo" | "load";

  interface Canvas {
    getConfig(): CanvasConfig | object;
    getElement(): HTMLElement;
    getFrameEl(): HTMLIFrameElement;
    getWindow(): Window;
    getDocument(): HTMLDocument;
    getBody(): HTMLBodyElement;
    getWrapperEl(): HTMLElement;
    setCustomBadgeLabel(f: Function): void;
    hasFocus(): boolean;
    scrollTo(
      el: HTMLElement | object,
      opts?: boolean | GrapesScrollIntoViewOptions
    ): void;
  }

  interface GrapesScrollIntoViewOptions extends ScrollIntoViewOptions {
    force?: boolean;
  }

  interface AssetManager {
    add(
      asset: string | object | Array<string> | Array<object>,
      opts?: object
    ): object;
    get(src: string): object;
    getAll(): Array<object>;
    getAllVisible(): Array<object>;
    remove(src: string): AssetManager;
    store(noStore: boolean): object;
    load(data?: object): object;
    getContainer(): HTMLElement;
    getAssetsEl(): HTMLElement;
    render(assets: Array<object>): HTMLElement;
    addType(id: string, definition: object): object;
    getType(id: string): object;
    getTypes(): Array<object>;
  }

  interface BlockManager {
    getConfig(): BlockManagerConfig | object;
    onLoad(): void;
    add(id: string, opts: BlockOptions): void;
    get(id: string): object;
    getAll(): Array<object>;
    getAllVisible(): Array<object>;
    remove(id: string): object;
    getCategories(): Array<object>;
    getContainer(): HTMLElement;
    render(): HTMLElement;
  }

  interface BlockOptions {
    label: string;
    content: string;
    category: string | object;
    attributes?: object;
  }

  interface SelectorManager {
    getConfig(): SelectorManagerConfig | object;
    add(
      name: string | Array<string>,
      opts: SelectorOptions | object
    ): Model | Array<object>;
    addClass(classes: Array<string> | string): Array<Object>;
    get(name: Model | Array<object>, type: string): Model | Array<object>;
    getAll(): Collection<Model>;
  }

  interface SelectorOptions {
    label?: string;
    type?: string;
  }

  interface CssComposer {
    load(data: object): object;
    store(noStore: boolean): object;
    add(
      selectors: Array<Object>,
      state: string,
      width: string,
      opts: object
    ): object;
    get(
      selectors: Array<Object>,
      state: string,
      width: string,
      ruleProps: object
    ): object | null;
    getAll(): Collection<Model>;
    clear(): CssComposer;
    setRule(): Object;
    getRule(): Object;
  }

  interface Modal {
    open(opts?: ModalOptions): Modal;
    close(): Modal;
    isOpen(): Boolean;
    setTitle(title: string): Modal;
    getTitle(): string;
    setContent(content: HTMLElement | string): Modal;
    getContent(): string;
  }

  interface ModalOptions {
    title?: HTMLElement | string;
    content?: HTMLElement | string;
  }

  /**
   * Configuration Interface
   */

  interface EditorConfig {
    stylePrefix?: string;
    components?: string;
    style?: string;
    fromElement?: boolean;
    noticeOnUnload?: boolean;
    showOffsets?: boolean;
    showOffsetsSelected?: boolean;
    forceClass?: boolean;
    height?: string;
    width?: string;
    log?: Array<"debug" | "info" | "warning" | "error"> | Array<string>;
    baseCss?: string;
    protectedCss?: string;
    canvasCss?: string;
    defaultCommand?: string;
    showToolbar?: boolean;
    allowScripts?: boolean;
    showDevices?: boolean;
    devicePreviewMode?: boolean;
    mediaCondition?: string;
    tagVarStart?: string;
    tagVarEnd?: string;
    keepEmptyTextNodes?: boolean;
    jsInHtml?: boolean;
    nativeDnD?: boolean;
    multipleSelection?: boolean;
    exportWrapper?: boolean;
    wrappesIsBody?: boolean;
    avoidInlineStyle?: boolean;
    avoidDefaults?: boolean;
    clearStyles?: boolean;
    container?: HTMLElement | string;
    undoManager?: object;
    assetManager?: AssetManagerConfig | object;
    canvas?: CanvasConfig | object;
    layers?: object;
    storageManager?: StorageManagerConfig | object;
    rte?: RichtTextEditorConfig | object;
    domComponents?: DomComponentsConfig | object;
    modal?: ModalConfig | object;
    codeManager?: CodeManagerConfig | object;
    panels?: PanelsConfig | object;
    commands?: CommandsConfig | object;
    cssComposer?: CssComposerConfig | object;
    selectorManager?: SelectorManagerConfig | object;
    deviceManager?: DeviceManagerConfig | object;
    styleManager?: StyleManagerConfig | object;
    blockManager?: BlockManagerConfig | object;
    traitManager?: TraitManagerConfig | object;
    textViewCode?: string;
    keepUnusedStyles?: boolean;
    multiFrames?: boolean;
  }

  interface AssetManagerConfig {
    assets?: Array<object>;
    noAssets?: string;
    stylePrefix?: string;
    upload?: boolean;
    uploadName?: string;
    headers?: object;
    params?: object;
    credentials?: RequestCredentials;
    multiUpload?: boolean;
    autoAdd?: boolean;
    uploadText?: string;
    addBtnText?: string;
    customFetch?: Function;
    uploadFile?: Function;
    embedAsBase64?: boolean;
    handleAdd?: Function;
    dropzone?: boolean;
    openAssetsOnDrop?: number;
    dropzoneContent?: string;
    modalTitle?: string;
    inputPlaceholder?: string;
  }

  interface CanvasConfig {
    stylePrefix?: string;
    scripts?: Array<string>;
    styles?: Array<string>;
    customBadgeLabel?: Function;
    autoscrollLimit?: number;
    notTextable?: Array<string>;
  }

  interface StyleManagerConfig {
    stylePrefix?: string;
    sectors?: Array<object>;
    appendTo?: HTMLElement | string;
    textNoElement?: string;
    hideNotStylable?: boolean;
    highlightChanged?: boolean;
    highlightComputed?: boolean;
    showComputed?: boolean;
    clearProperties?: boolean;
    avoidComputed?: Array<string>;
  }

  interface BlockManagerConfig {
    appendTo?: HTMLElement | string;
    blocks: Array<object>;
  }

  interface RichtTextEditorConfig {
    stylePrefix?: string;
    adjustToolbar?: boolean;
    actions?: Array<string>;
  }

  interface TraitManagerConfig {
    stylePrefix?: string;
    appendTo?: HTMLElement | string;
    labelContainer?: string;
    labelPlhText?: string;
    labelPlhRef?: string;
    optionsTarget?: Array<object>;
    textNoElement?: string;
  }

  interface StorageManagerConfig {
    id?: string;
    autosave?: boolean;
    autoload?: boolean;
    type?: "local" | "remote";
    stepsBeforeSave?: number;
    storeComponents?: boolean;
    storeStyles?: boolean;
    storeHtml?: boolean;
    storeCss?: boolean;
    checkLocal?: boolean;
    params?: object;
    headers?: object;
    urlStore?: string;
    urlLoad?: string;
    contentTypeJson?: boolean;
    credentials?: RequestCredentials;

    beforeSend(jqXHR: any, settings: object): void;
    onComplete(jqXHR: any, status: any): void;
  }

  interface DomComponentsConfig {
    stylePrefix?: string;
    wrapperId?: string;
    wrapperName?: string;
    wrapper?: DomComponentsWrapperConfig;
    components?: Array<object>;
    imageCompClass?: string;
    oAssetsOnCreate?: boolean;
    storeWrapper?: boolean;
    voidElements?: Array<string>;
  }

  interface DomComponentsWrapperConfig {
    removable?: boolean;
    copyable?: boolean;
    draggable?: boolean;
    // TODO: Type custom blocks and components
    components?: Array<object>;
    traits?: Array<object>;
    stylable?: Array<string>;
  }

  interface ModalConfig {
    stylePrefix?: string;
    title?: string;
    content?: string;
    backdrop?: boolean;
  }

  interface CodeManagerConfig {
    stylePrefix?: string;
    inlineCss?: boolean;
  }

  interface PanelsConfig {
    stylePrefix?: string;
    defaults?: Array<object>;
    em?: object;
    delayBtnsShow?: number;
  }

  interface CommandsConfig {
    ESCAPE_KEY?: number;
    stylePrefix?: string;
    defaults?: Array<object>;
    em?: object;
    firstCentered?: boolean;
    newFixedH?: boolean;
    minComponentH?: number;
    minComponentW?: number;
  }

  interface CssComposerConfig {
    stylePrefix?: string;
    staticRules?: string;
    rules?: Array<string>;
  }

  interface SelectorManagerConfig {
    stylePrefix?: string;
    appendTo?: HTMLElement | string;
    selectors?: Array<string>;
    label?: string;
    statesLabel?: string;
    selectedLabel?: string;
    states?: Array<object>;
  }

  interface DeviceManagerConfig {
    devices?: Array<object>;
    deviceLabel?: string;
  }

  /**
   * Configuration Interface End
   */

  interface LogOptions {
    ns?: string;
    level?: "debug" | "info" | "warning" | "error";
  }
}
