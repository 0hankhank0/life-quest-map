"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { SocialCardFormat } from "@/components/SocialPostCard";
import { socialCardFormats } from "./FormatSelector";

export function ScaledSocialPreview({ format, children }: { format: SocialCardFormat; children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1080);
  useLayoutEffect(() => {
    const stage = stageRef.current; if (!stage) return;
    const update = () => setWidth(stage.clientWidth);
    update(); const observer = new ResizeObserver(update); observer.observe(stage);
    return () => observer.disconnect();
  }, []);
  const style = { aspectRatio: socialCardFormats.find((item) => item.value === format)!.ratio, "--social-preview-scale": width / 1080 } as CSSProperties;
  return <div className="social-post-preview-shell"><div ref={stageRef} className="social-post-stage" data-testid="social-post-stage" style={style}><div className="social-post-scale">{children}</div></div></div>;
}
