interface Crafty {
    (selector: string): Entities;
    (id: number): Entity;

    get(): Entities;
    get(index: number): Entity;

    diamondIso: DiamondIso;
    isometric: Isometric;
    math: CraftyMath;
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
    toString(): string;
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
}

interface ComponentDraggable {
    disableDrag(): Entity;
    dragDirection(): Entity;
    dragDirection(vector): Entity;
    dragDirection(degree): Entity;
    enableDrag(): Entity;
}

interface Reel extends String, Object {

}

interface ComponentSpriteAnimation {
    animationSpeed: Reel;
    animate(reelId?: String, loopCount?: Number): Entity;
    getReel(): Reel;
    getReel(reelId): Reel;
    isPlaying(reelId?: String): boolean;
    loops(loopCount: Number): Entity;
    loops(): number;
    pauseAnimation(): Entity;
    reel(reelId: String, duration: number, fromX: Number, fromY: Number, frameCount: Number): Entity;
    reel(reelId: String, duration: number, frames: any): Entity;
    reel(reelId: String): Entity;
    reel(): Reel;
    reelPosition(position: Number): Entity;
    reelPosition(position: String): Entity;
    reelPosition(): number;
    resetAnimation(): Entity;
    resumeAnimation(): Entity;
}

interface ComponentSupportable {
    canLand: boolean;
    ground: Entity;
}

interface ComponentTween {
    cancelTween(target: String): Entity;
    cancelTween(target: Object): Entity;
    pauseTweens(): Entity;
    resumeTweens(): Entity;
    tween(properties: Object, duration: Number, easingFn: Function): Entity;
}

interface ComponentMotion {
    ax: any;
    ay: any;
    dx: any;
    dy: any;
    vx: any;
    vy: any;
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
    centerAt(x: Number, y: Number): Isometric;
    place(x: Number, y: Number, z: Number, tile: Entity): Isometric;
    pos(x: Number, y: Number): any;
    px(left: Number, top: Number): any;
    size(tileSize: Number): Isometric;
}

interface DiamondIso {
    init(tileWidth: Number, tileHeight: Number, mapWidth: Number, mapHeight: Number): DiamondIso;
    place(tile: Entity, x: Number, y: Number, layer: Number): void;
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
    ComponentDraggable {
}

declare var Crafty: Crafty;
