import React from "react";

type Props = {
  content: {
    title: string;
    items: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
  editing?: boolean;
  updateContent?: (newContent: any) => void;
};

const FeaturesGrid = ({ content, editing, updateContent }: Props) => {
  return (
    <section className="section features">
      <div className="container">

        <h2
          className="heading"
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={(e) =>
            updateContent?.({ ...content, title: e.currentTarget.innerHTML })
          }
        >
          {content.title}
        </h2>

        <div className="features-grid">
          {content.items.map((item, index) => (
            <div key={index} className="feature">

              <div
                className="feature-icon"
                contentEditable={editing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newItems = [...content.items];
                  newItems[index].icon = e.currentTarget.innerHTML;
                  updateContent?.({ ...content, items: newItems });
                }}
              >
                {item.icon}
              </div>

              <h3
                className="feature-title"
                contentEditable={editing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newItems = [...content.items];
                  newItems[index].title = e.currentTarget.innerHTML;
                  updateContent?.({ ...content, items: newItems });
                }}
              >
                {item.title}
              </h3>

              <p
                className="feature-description"
                contentEditable={editing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newItems = [...content.items];
                  newItems[index].description = e.currentTarget.innerHTML;
                  updateContent?.({ ...content, items: newItems });
                }}
              >
                {item.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesGrid;