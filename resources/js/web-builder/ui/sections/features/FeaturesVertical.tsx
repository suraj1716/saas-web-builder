type Props = {
  content: {
    title: string
    items: {
      icon: string
      text: string
    }[]
  }
}

export const FeaturesVertical = ({ content }: Props) => {
  return (
    <section style={{ padding: 60 }}>
      <h2>{content.title}</h2>
      {content.items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <div>{item.icon}</div>
          <div>{item.text}</div>
        </div>
      ))}
    </section>
  )
}