import { NativeModule, registerWebModule } from "expo";

class PeekPreviewModule extends NativeModule {}

export default registerWebModule(PeekPreviewModule, "PeekPreviewModule");
