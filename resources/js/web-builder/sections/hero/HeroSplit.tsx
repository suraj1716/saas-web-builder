type Props = {
    content: {
      title: string
      subtitle: string
      buttonText: string
    }
  }
  
  export const HeroSplit = ({ content }: Props) => {
    return (
      <section style={{ padding: 80, textAlign: "center" }}>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
        <button>{content.buttonText}</button>
      </section>
    )
  }