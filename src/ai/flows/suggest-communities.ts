'use server';

/**
 * @fileOverview Suggests relevant communities to a user based on their profile information.
 *
 * - suggestCommunities - A function that suggests communities for a user to join.
 * - SuggestCommunitiesInput - The input type for the suggestCommunities function.
 * - SuggestCommunitiesOutput - The return type for the suggestCommunities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCommunitiesInputSchema = z.object({
  skills: z
    .string()
    .describe('A comma-separated list of the user\u2019s skills.'),
  learningGoals:
    z.string().describe('A description of the user\u2019s learning goals.'),
  interests:
    z.string().describe('A description of the user\u2019s interests.'),
});
export type SuggestCommunitiesInput = z.infer<typeof SuggestCommunitiesInputSchema>;

const SuggestCommunitiesOutputSchema = z.object({
  suggestedCommunities: z
    .array(z.string())
    .describe(
      'A list of suggested community names that align with the user\u2019s profile information.'
    ),
});
export type SuggestCommunitiesOutput = z.infer<typeof SuggestCommunitiesOutputSchema>;

export async function suggestCommunities(
  input: SuggestCommunitiesInput
): Promise<SuggestCommunitiesOutput> {
  return suggestCommunitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCommunitiesPrompt',
  input: {schema: SuggestCommunitiesInputSchema},
  output: {schema: SuggestCommunitiesOutputSchema},
  prompt: `Based on the following information about a new user, suggest a list of relevant communities for them to join. The response should be a list of community names.

Skills: {{{skills}}}
Learning Goals: {{{learningGoals}}}
Interests: {{{interests}}}`,
});

const suggestCommunitiesFlow = ai.defineFlow(
  {
    name: 'suggestCommunitiesFlow',
    inputSchema: SuggestCommunitiesInputSchema,
    outputSchema: SuggestCommunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
