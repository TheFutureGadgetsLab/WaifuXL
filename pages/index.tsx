import React from "react";
import {
  EuiPage,
  EuiPageSidebar,
  EuiPageBody,
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiHorizontalRule,
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiText,
  EuiProvider,
} from "@elastic/eui";

import Table from "components/table";
import { ReactCompareSlider } from "react-compare-slider";
import Image from "next/image";
import senjo from "public/images/senjo.webp";
import Kizuna from 'public/images/DesktopBG.svg';


export function GitHubSVG() {
  return (
    <a
      aria-label="Github Link"
      href="https://github.com/TheFutureGadgetsLab/WaifuXL"
      target="_blank"
      rel="noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    </a>
  );
}

const imageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number | undefined;
  quality?: number | undefined;
}) => {
  return `${src}`;
};

export default function Home() {
  return (
    <main>
      <EuiProvider colorMode="light">
      <EuiPage paddingSize="none">
        <EuiPageSidebar paddingSize="none">
          <EuiPanel hasShadow={false} css={{ "background-color": "#f5f5f5" }}>
            <EuiFlexGroup gutterSize="s" responsive={false} direction="column">
              <EuiFlexItem grow={true}>
                <EuiButton
                  iconType="image"
                  style={{ textAlign: "left" }}
                  fill={true}
                  css={{ "background-color": "#FF869C" }}
                >
                  Choose Image/GIF
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={true}>
                <EuiButton
                  iconType="download"
                  css={{ "background-color": "#FF869C" }}
                  fill={true}
                >
                  Download
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={true}>
                <EuiButton
                  iconType="share"
                  css={{ "background-color": "#FF869C" }}
                  fill={true}
                >
                  Post To Imgur
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiHorizontalRule size="full" />

            <Table />
          </EuiPanel>
        </EuiPageSidebar>
        <EuiPageBody paddingSize="none" panelled={false}>
          <EuiPanel hasShadow={false} paddingSize="none">
            <EuiHeader css={{ backgroundColor: "#FF869C" }}>
              <EuiFlexGroup
                gutterSize="m"
                responsive={false}
                justifyContent="center"
                alignItems="center"
              >
                <EuiFlexItem grow={false}>
                  <EuiText color="black" size="m">
                    <h1>About</h1>
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiText color="white" size="m">
                    <h1>WaifuXL</h1>
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiText color="black" size="m">
                    <h1>Donate</h1>
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiHeaderSection side="right">
                <EuiHeaderSectionItem>
                  <GitHubSVG />
                </EuiHeaderSectionItem>
              </EuiHeaderSection>
            </EuiHeader>
            <EuiFlexGroup
              gutterSize="none"
              responsive={true}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <EuiFlexItem grow={true}>
                <ReactCompareSlider
                  position={50}
                  itemOne={
                    <Image
                      width="500"
                      height="500"
                      src={senjo}
                      id="before-image"
                      className="z-0"
                      priority={true}
                      alt="Before image"
                      loader={imageLoader}
                    />
                  }
                  itemTwo={
                    <Image
                      width="500"
                      height="500"
                      src={"https://i.imgur.com/7WcPlwS.png"}
                      id="after-image"
                      className="z-0"
                      priority={true}
                      alt="After image"
                      loader={imageLoader}
                    />
                  }
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiPageBody>
      </EuiPage>
      </EuiProvider>
    </main>
  );
}
