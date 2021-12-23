import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "简单易用",
    image: "/img/undraw_docusaurus_mountain.svg",
    description: <>配置式绘制海报</>,
  },
  {
    title: "高度自定义",
    image: "/img/undraw_docusaurus_tree.svg",
    description: <>获取canvas实例完成自定义绘制，做你想做</>,
  },
  {
    title: "丰富的类型支持",
    image: "/img/undraw_docusaurus_react.svg",
    description: <>完全使用typescript编写</>,
  },
];

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
