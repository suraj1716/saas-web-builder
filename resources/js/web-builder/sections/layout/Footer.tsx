import React from "react";

type Props = {
  content: { copyright: string };
  editing?: boolean;
  updateContent?: (newContent: any) => void;
};

const Footer: React.FC<Props> = ({ content, editing, updateContent }) => {
  return (
    <footer className="footer">

      {editing ? (
        <input
          value={content.copyright}
          onChange={(e) =>
            updateContent?.({ copyright: e.target.value })
          }
          className="footer-input"
        />
      ) : (
        <p className="footer-text">{content.copyright}</p>
      )}

    </footer>
  );
};

export default Footer;