import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';

type OllamaChatResponse = {
  message?: {
    content?: string;
  };
};

@Injectable()
export class AiService {
  async chat(message: string) {
    const prompt = message.trim();
    if (prompt.length < 2) {
      throw new BadRequestException('Question manquante');
    }

    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.2';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: false,
          options: {
            num_predict: 2048,
            temperature: 0.7,
          },
          messages: [
            {
              role: 'system',
              content:
                'Tu es Lamma, un assistant IA generaliste integre a بنة تونسية. Reponds en francais clair a toutes les questions du client: culture generale, cuisine, recettes, etudes, technologie, idees, explications, redaction, conseils pratiques et aide بنة تونسية. Ne limite pas tes reponses aux sujets بنة تونسية. Si la question concerne la sante, le droit, la finance, la securite, un paiement ou une decision importante, reponds prudemment et conseille de verifier avec une source fiable ou un professionnel. Si tu ne sais pas, dis-le clairement au lieu d inventer.',
            },
            { role: 'user', content: prompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama ${response.status}`);
      }

      const data = (await response.json()) as OllamaChatResponse;
      const answer = data.message?.content?.trim();
      if (!answer) {
        throw new Error('Reponse Ollama vide');
      }

      return { answer };
    } catch {
      throw new BadGatewayException(
        'Lamma IA est indisponible. Verifiez que Ollama est lance et que le modele Llama est installe.',
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}
