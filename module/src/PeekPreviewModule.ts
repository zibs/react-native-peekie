import { NativeModule, requireNativeModule } from "expo";

declare class PeekPreviewModule extends NativeModule {}

export default requireNativeModule<PeekPreviewModule>("PeekPreviewModule");
