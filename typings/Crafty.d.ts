declare module CraftyModule {
    interface Crafty {
        support: CraftySupport;
        settings: CraftySettings;
        diamondIso: DiamondIso;
        isometric: Isometric;
        math: CraftyMath;
        assets: any;
        circle: CraftyCircle;
        keys: CraftyKeys;
        mobile: boolean;
        viewport: CraftyViewport;
        timer: CraftyTimer;
        stage: {
            elem: HTMLElement
        };

        (selector: string): Entities;
        (id: number): Entity;

        get(): Entities;
        get(index: number): Entity;

        //e(components: string): Entity;
        e(...component: string[]): Entity;

        c(name: string, component: any): void;

        defineField(ent: Entity, property: string, getCallback: Function, setCallback: Function): Crafty;
        clone(obj: Entity): Entity;
        extend(obj: Object): Crafty;
        frame(): number;
        getVersion(): string;

        init(): Crafty;
        init(width: number): Crafty;
        init(width: number, height: number): Crafty;
        init(width: number, height: number, stage_elem: string): Crafty;
        init(width: number, height: number, stage_elem: HTMLElement): Crafty;

        isPaused(): boolean;
        one(eventName: string, callback: Function): number;
        pause(): Crafty;

        s(name: string, template: Object, lazy?: boolean): any;
        s(name: string): any;

        bind(eventName: string, callback: Function): Entity;
        unbind(eventName: string, callback?: Function): Entity;
        uniqueBind(eventName: string, callback: Function): number;

        trigger(eventName: String, data: any): void;
        stop(clearState?: boolean): Crafty;

        background(style: string): void;
        pixelart(enabled: boolean): void;

        scene(sceneName: string, init: Function, uninit?: Function): void;
        scene(sceneName: string, data: any): void;

        removeAssets(assets: CraftyAssetObject): void;

        sprite(tile?: number, tileh?: number, url?: string, map?: Object, paddingX?: number, paddingY?: number, paddingAroundBorder?: boolean): Crafty;

        addEvent(ctx: Object, obj: HTMLElement, event: string, callback: Function): Crafty;

        deviceMotion(callback: Function): void;
        deviceOrientation(callback: Function): void;

        asset(key: String, asset: CraftyAssetObject): void;
        asset(key: String): any;

        paths(paths: CraftyAssetObject);
        paths();

        findClosestEntityByComponent(component: string, x: number, y: number, target?: Entity): Entity;
    }

    interface ComponentDelay {
        cancelDelay(callback: Function): void;
        delay(callback: Function, delay: number, repeat?: number, callbackOff?: Function): void;
    }

    interface CraftyTimer {
        FPS(): number;
        FPS(value: number): void;
        simulateFrames(frames: number, timestep?: number): void;
        step(): void;
        steptype(mode: string, maxTimeStep?: number): void;
    }

    interface CraftyViewport {
        _scale: number;
        bounds: CraftyBounds;
        clampToEntities: boolean;
        x: number;
        y: number;
        width: number;
        height: number;
        _x: number;
        _y: number;
        _width: number;
        _height: number;

        centerOn(target: Entity, time: number): void;
        follow(target: Entity, offsetx: number, offsety: number): void;
        init(): void;
        init(width: number, height: number): void;
        init(width: number, height: number, stage_elem: string): void;
        init(width: number, height: number, stage_elem: HTMLElement): void;
        mouselook(active: boolean): void;
        onScreen(rect: Rectangle): boolean;
        pan(dx: number, dy: number, time: number, easingFn: Function): void;
        scale(amt: number): void;
        axis(axis: string, val: number): string;
        zoom(amt: number, cent_x: number, cent_y: number, time: number, easingFn: Function): void;
    }

    interface CraftyBounds {
        min: Position2D;
        max: Position2D;
    }

    interface ParticleConfig {
        maxParticles: number;
        size: number;
        sizeRandom: number;
        speed: number;
        speedRandom: number;
        lifeSpan: number;
        lifeSpanRandom: number;
        angle: number;
        angleRandom: number;
        startColour: Array<number>;
        startColourRandom: Array<number>;
        endColour: Array<number>;
        endColourRandom: Array<number>;
        sharpness: number;
        sharpnessRandom: number;
        spread: number;
        duration: number;
        fastMode: boolean;
        gravity: Position2D;
        jitter: number;
        originOffset: Position2D;
    }

    interface ComponentParticles {
        particles(options: ParticleConfig): Entity;
    }

    interface CraftyKeys {
        BACKSPACE: number;
        TAB: number;
        ENTER: number;
        PAUSE: number;
        CAPS: number;
        ESC: number;
        SPACE: number;
        PAGE_UP: number;
        PAGE_DOWN: number;
        END: number;
        HOME: number;
        LEFT_ARROW: number;
        UP_ARROW: number;
        RIGHT_ARROW: number;
        DOWN_ARROW: number;
        INSERT: number;
        DELETE: number;
        0: number;
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
        6: number;
        7: number;
        8: number;
        9: number;
        A: number;
        B: number;
        C: number;
        D: number;
        E: number;
        F: number;
        G: number;
        H: number;
        I: number;
        J: number;
        K: number;
        L: number;
        M: number;
        N: number;
        O: number;
        P: number;
        Q: number;
        R: number;
        S: number;
        T: number;
        U: number;
        V: number;
        W: number;
        X: number;
        Y: number;
        Z: number;
        NUMPAD_0: number;
        NUMPAD_1: number;
        NUMPAD_2: number;
        NUMPAD_3: number;
        NUMPAD_4: number;
        NUMPAD_5: number;
        NUMPAD_6: number;
        NUMPAD_7: number;
        NUMPAD_8: number;
        NUMPAD_9: number;
        MULTIPLY: number;
        ADD: number;
        SUBSTRACT: number;
        DECIMAL: number;
        DIVIDE: number;
        F1: number;
        F2: number;
        F3: number;
        F4: number;
        F5: number;
        F6: number;
        F7: number;
        F8: number;
        F9: number;
        F10: number;
        F11: number;
        F12: number;
        SHIFT: number;
        CTRL: number;
        ALT: number;
        PLUS: number;
        COMMA: number;
        MINUS: number;
        PERIOD: number;
        PULT_UP: number;
        PULT_DOWN: number;
        PULT_LEFT: number;
        PULT_RIGHT: number;
    }

    interface CraftyAssetObject {
        audio: Object;
        images: Object;
        sprites: Object;
    }

    interface CraftyCircle {
        containsPoint(x: number, y: number): boolean;
        shift(x: number, y: number): void;
    }

    interface CraftySupport {
        audio: boolean;
        canvas: boolean;
        css3dtransform: boolean;
        defineProperty: boolean;
        devicemotion: boolean;
        deviceorientation: boolean;
        prefix: string;
        version: number;
        versionName: string;
        webgl: boolean;
    }

    interface CraftySettings {
        get(settingName: string): any;
        modify(settingName: string, value: any): void;
        register(settingName: string, callback: Function): void;
    }

    interface Rectangle {
        x: number;
        y: number;
        w: number;
        h: number;
    }

    interface Position2D {
        x: number;
        y: number;
    }

    interface Vector2D {
        (): Vector2D;
        (vec: Vector2D): Vector2D;
        (x: number, y: number): Vector2D;
        add(vec: Vector2D): Vector2D;
        angleBetween(vector: Vector2D): number;
        angleTo(vector: Vector2D): number;
        clone(): Vector2D;
        crossProduct(vector: Vector2D): number;
        distance(vector: Vector2D): number;
        distanceSq(vector: Vector2D): number;
        divide(vector: Vector2D): Vector2D;
        dotProduct(vector: Vector2D): number;
        equals(vector: Vector2D): boolean;
        getNormal(vector1: Vector2D, vector2: Vector2D): Vector2D;
        isZero(): boolean;
        magnitude(): number;
        magnitudeSq(): number;
        multiply(vector: Vector2D): Vector2D;
        negate(): Vector2D;
        normalize(): Vector2D;
        perpendicular(vector: Vector2D): Vector2D;
        scale(x: number, y: number): Vector2D;
        scaleToMagnitude(scale: number): Vector2D;
        setValues(vector: Vector2D): Vector2D;
        setValues(x: number, y: number): Vector2D;
        subtract(vector: Vector2D): Vector2D;
        tostring(): string;
        translate(x: number, y: number): Vector2D;
        tripleProduct(vector1: Vector2D, vector2: Vector2D, vector3: Vector2D, vector4: Vector2D): Vector2D;
    }

    interface CraftyMath {
        Vector2D: Vector2D;
    }

    interface ComponentCanvas {
        draw(ctx?: CanvasRenderingContext2D, x?: number, y?: number, w?: number, h?: number): Entity;
    }

    interface ComponentAngularMotion {
        arotation: number;
        drotation: number;
        vrotation: number;
        resetAngularMotion(): Entity;
    }

    interface Polygon extends Array<number> {

    }

    interface BaseEntity {
        addComponent(...component: string[]): Entity;
        attr(property: string, value: any, silent?: boolean, recursive?: boolean): Entity;
        attr(map: any, silent?: boolean, recursive?: boolean): Entity;
        bind(eventName: string, callback: Function): Entity;
        clone(): Entity;
        defineField(property: string, getCallback: Function, setCallback: Function): Entity;
        destroy(): Entity;
        each(method: Function): Entity;
        getId(): number;
        has(component: string): boolean;
        one(eventName: string, callback: Function): number;
        removeComponent(component: string, soft?: boolean): Entity;
        requires(componentList: string): Entity;
        setName(componentList: string): Entity;
        setter(property: string, callback: Function): Entity;
        timeout(callback: Function, delay: number): Entity;
        toggleComponent(ComponentList: string): Entity;
        toggleComponent(...component: string[]): Entity;
        trigger(eventName: string, data?: any): Entity;
        unbind(eventName: string, callback?: Function): Entity;
        uniqueBind(eventName: string, callback: Function): number;
        trigger(eventName: String, data: any): void;
    }

    interface ComponentSprite {
        __coord: Rectangle;
        crop(x: Number, y: Number, w: Number, h: Number): Entity;
        sprite(x: Number, y: Number, w?: Number, h?: Number): Entity;
    }

    interface ComponentFourway {
        fourway(speed?: number): Entity;
    }

    interface ComponentDraggable {
        disableDrag(): Entity;
        dragDirection(): Entity;
        dragDirection(vector): Entity;
        dragDirection(degree): Entity;
        enableDrag(): Entity;
    }

    interface Reel extends Object {

    }

    interface ComponentSpriteAnimation {
        animationSpeed: Reel;
        animate(reelId?: string, loopCount?: number): Entity;
        getReel(): Reel;
        getReel(reelId): Reel;
        isPlaying(reelId?: string): boolean;
        loops(loopCount: number): Entity;
        loops(): number;
        pauseAnimation(): Entity;
        reel(reelId: string, duration: number, fromX: number, fromY: number, frameCount: number): Entity;
        reel(reelId: string, duration: number, frames: any): Entity;
        reel(reelId: string): Entity;
        reel(): Reel;
        reelPosition(position: number): Entity;
        reelPosition(position: string): Entity;
        reelPosition(): number;
        resetAnimation(): Entity;
        resumeAnimation(): Entity;
    }

    interface ComponentDOM {
        _element: HTMLElement;
        avoidCss3dTransforms: boolean;
        css(property: string, value: string): void;
        css(map: Object): void;
        DOM(elem: HTMLElement): Entity;
    }

    interface WebGL {
        context: WebGLRenderingContext;
    }

    interface ComponentHTML {
        append(html: string): Entity;
        prepend(html: string): Entity;
        replace(html: string): Entity;
    }

    interface ComponentSupportable {
        canLand: boolean;
        ground: Entity;
    }

    interface ComponentTween {
        cancelTween(target: string): Entity;
        cancelTween(target: Object): Entity;
        pauseTweens(): Entity;
        resumeTweens(): Entity;
        tween(properties: Object, duration: number, easingFn?: Function): Entity;
    }

    interface ComponentMotion {
        ax: number;
        ay: number;
        dx: number;
        dy: number;
        vx: number;
        vy: number;

        acceleration(): Vector2D;
        motionDelta(): Vector2D;
        resetMotion(): any;
        velocity(): Vector2D;
    }

    interface ComponentGravity {
        antigravity(): Entity;
        gravity(comp): Entity;
        gravityConst(g): Entity;
    }

    interface Isometric {
        area(): any;
        centerAt(): any;
        centerAt(x: number, y: number): Isometric;
        place(x: number, y: number, z: number, tile: Entity): Isometric;
        pos(x: number, y: number): any;
        px(left: number, top: number): any;
        size(tileSize: number): Isometric;
    }

    interface DiamondIso {
        init(tileWidth: number, tileHeight: number, mapWidth: number, mapHeight: number): DiamondIso;
        place(tile: Entity, x: number, y: number, layer: number): void;
    }

    interface ComponentColor {
        color(color: String, strength?: number): Entity;
        color(r: number, g: number, b: number, strength: number): Entity;
        color(): string;
    }

    interface ComponentCollision {
        checkHits(componentList: string): Entity;
        checkHits(...component: string[]): Entity;
        collision(coordinatePairs?: Polygon): Entity;
        collision(...xy: number[]): Entity;
        hit(component: string): boolean;
        ignoreHits(): Entity;
        ignoreHits(componentList: string): Entity;
        ignoreHits(...component: string[]): Entity;
        onHit(component: string, callbackOn: Function, callbackOff?: Function): Entity;
        resetHitChecks(): Entity;
        resetHitChecks(componentList: string): Entity;
        resetHitChecks(...component: string[]): Entity;
    }

    interface ComponentJumper {
        canJump: boolean;
        disableControl(): Entity;
        enableControl(): Entity;
        jumper(jumpSpeed?: Number, jumpKeys?: any): Entity;
        jumpSpeed(jumpSpeed: Number): Entity;
    }

    interface ComponentMultiway {
        disableControl(): Entity;
        enableControl(): Entity;
        multiway(speed?: Number, keyBindings?: Object): Entity;
        speed(speed: Object): Entity;
    }

    interface ComponentTwoway {
        twoway(speed?: Number, jumpSpeed?: Number): Entity;
    }

    interface Component2D {
        _attr: any;
        _globalZ: number;
        alpha: number;
        h: number;
        rotation: number;
        visible: boolean;
        w: number;
        x: number;
        y: number;
        z: number;

        cascade(e): void;
        area(): number;
        attach(...obj: Entity[]): Entity;
        contains(x: number, y: number, w: number, h: number): boolean;
        contains(rect: Rectangle): boolean;
        detach(obj?: Entity): Entity;
        flip(dir: string): Entity;
        intersect(x: number, y: number, w: number, h: number): boolean;
        intersect(rect: Rectangle): boolean;
        isAt(x: number, y: number): boolean;
        mbr(): Rectangle;
        move(dir: string, by: number): Entity;
        offsetBoundary(dx1: number, dy1: number, dx2: number, dy2: number): Entity;
        offsetBoundary(offset: number): Entity;
        origin(x: number, y: number): Entity;
        origin(offset: string): Entity;
        pos(pos?: Position2D): any;
        shift(x: number, y: number, w: number, h: number): Entity;
        unflip(dir: string): Entity;
        within(x: number, y: number, w: number, h: number): boolean;
        within(rect: Rectangle): boolean;
    }

    interface ComponentImage {
        image(url: string, repeat?: string): Entity;
    }

    interface ComponentText {
        text(text: string): Entity;
        text(textGenerator: Function): Entity;
        textColor(color: string): Entity;
        textFont(key: string): Entity;
        textFont(key: string, value: any): Entity;
        textFont(map: Object): Entity;
        unselectable(): Entity;
    }

    interface Entities extends Array<Entity> {
        length: number;
        each: Function;
        get(index: number): Entity;
    }

    interface Entity extends BaseEntity,
        Component2D,
        ComponentCanvas,
        ComponentAngularMotion,
        ComponentCollision,
        ComponentGravity,
        ComponentMotion,
        ComponentSupportable,
        ComponentTween,
        ComponentSpriteAnimation,
        ComponentDraggable,
        ComponentFourway,
        ComponentJumper,
        ComponentMultiway,
        ComponentTwoway,
        ComponentDOM,
        ComponentHTML,
        ComponentSprite,
        ComponentColor,
        ComponentImage,
        ComponentText,
        ComponentParticles,
        ComponentDelay {
    }
}

declare var Crafty: CraftyModule.Crafty;
