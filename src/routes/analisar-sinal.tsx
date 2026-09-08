import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/analisar-sinal")({
  component: AnalisarSinal,
});

function AnalisarSinal() {
  return (
    <section className="min-h-screen bg-background text-foreground px-6 py-20">
      <h1 className="text-4xl font-bold mb-4">ANÁLISE DE SINAL</h1>
      <p>Descubra o sinal do seu negócio.</p>
    </section>
  );
}
