import { createOpenAI } from "@ai-sdk/openai";
import {
  AssistantButton,
  ChatPage,
  LocalSession,
  useChat,
  Widgets,
} from "@greenstones/qui-ai";
import { Agent, tool } from "@openai/agents";
import { aisdk } from "@openai/agents-extensions/ai-sdk";
import { Card, CardBody, Col, Row } from "react-bootstrap";
import z from "zod";

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1/",
});

export const weatherTool = tool({
  name: "get_weather",
  description: `Get the weather forecast fo a givven city`,
  parameters: z.object({
    city: z.string().describe("city"),
  }),
  execute: async ({ city }) => {
    console.log(city);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return {
      status: "success",
      temperature: Math.floor(Math.random() * (20 - 5 + 1)) + 5,
    };
  },
});

export const displayWeatherTool = tool({
  name: "display_weather_as_card",
  description: `Get the weather forecast fo a givven city`,
  parameters: z.object({
    city: z.string().describe("city"),
  }),
  execute: async ({ city }) => {
    console.log(city);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return {
      status: "success",
      temperature: Math.floor(Math.random() * (20 - 5 + 1)) + 5,
    };
  },
});

const model = aisdk(openai("gpt-4.1-mini"));
const session = new LocalSession("weather");

const agent = new Agent({
  name: "Weather Agent",
  instructions: `An intelligent assistant that provides current weather information. 
  It shows temperatures, conditions, and forecasts for any city on demand, and can display the data clearly in tables or lists.

  <formatting_rules>

When responding, enrich your answer with inline custom components where
relevant. Components are tags (<my-component>text</my-component>) placed naturally within the
response text, not wrapping it.

<short-weather>
  TRIGGER: A brief weather snapshot is relevant to the answer
           e.g. "weather in X", "is it cold in X?"
  ATTRIBUTES:
    - location: city name
    - temperature: current temperature 
  USAGE: Inline within text
  EXAMPLE:
    The current conditions in Frankfurt are:
    <short-weather location="Frankfurt" temperature="22">Frankfurt/22</short-weather>
</short-weather>



</formatting_rules>

  `,
  model: model,
  tools: [weatherTool],
});

export function WeatherAgentPage() {
  const widgets: Widgets = {
    "short-weather": (props: any) => {
      return (
        <Card className="my-3 bg-light">
          <CardBody>
            <Row className="align-items-center">
              <Col className="display-6">{props.location}</Col>
              <Col className="display-3 text-end pe-4">
                +{props.temperature}°C
              </Col>
            </Row>
          </CardBody>
        </Card>
      );
    },
  };

  const chat = useChat({
    agent,
    session,
    widgets,
  });

  return (
    <ChatPage
      header="Weather Agent"
      headerLead={`    
          An intelligent assistant that provides current weather information. It
          shows temperatures, conditions, and forecasts for any city on demand.
      `}
      chat={chat}
      examples={[
        "What’s the weather like in Frankfurt?",
        "Create a table listing the current weather in the 5 largest German cities",
      ]}
      containerWidth={6}
      variant="bordered"
      formClassName="bg-light"
      userMessagePosition="end"
    >
      <AssistantButton chat={chat} />
    </ChatPage>
  );
}

const s1 = `An intelligent assistant that provides current weather information. 
  It shows temperatures, conditions, and forecasts for any city on demand, and can display the data clearly in tables or lists.

  <formatting_rules>

When responding, enrich your answer with inline custom components where
relevant. Components are self-closing tags placed naturally within the
response text, not wrapping it.

<short_card>
  TRIGGER: A quick summary is useful alongside the answer
           e.g. "what is X", "quick info on X", "briefly describe X"
  USAGE: Inline within text
  EXAMPLE:
    Here is a quick overview of Frankfurt: <short_card title="Frankfurt, Germany"/>
</short_card>

<full_card>
  TRIGGER: Detailed structured info would complement the answer
           e.g. "tell me about X", "full details on X", "explain X"
  USAGE: Inline within text
  EXAMPLE:
    Here is everything you need to know about Frankfurt: <full_card title="Frankfurt, Germany"/>
</full_card>

<bar_chart>
  TRIGGER: A bar chart would help visualise the data being discussed
           e.g. "compare X", "show as chart", "visualise X", "rank X"
  ATTRIBUTES:
    - title: chart title
    - x_label: x-axis label
    - y_label: y-axis label
    - unit: value unit (e.g. °C, %, $)
    - data: JSON-encoded array of {label, value, secondary_value?, icon?}
  USAGE: Inline within text
  EXAMPLE:
    Here is the 5-day forecast for Frankfurt:
    <bar_chart title="5-Day Forecast" x_label="Day" y_label="Temp" unit="°C"
      data='[{"label":"Sat","value":10,"icon":"☁️"},{"label":"Sun","value":12,"icon":"🌨"},{"label":"Mon","value":13,"icon":"🌥"}]'/>
    Temperatures will rise steadily toward the end of the week.
</bar_chart>

<data_table>
  TRIGGER: Tabular comparison or structured list would add clarity
           e.g. "compare X and Y", "list all X", "show as table"
  ATTRIBUTES:
    - title: table title
    - columns: JSON-encoded array of column header strings
    - rows: JSON-encoded 2D array of row values
    - highlight_column: optional column index to emphasise
  USAGE: Inline within text
  EXAMPLE:
    Here is a comparison of the top financial cities in Europe:
    <data_table title="Top Financial Cities" highlight_column="3"
      columns='["City","Country","Exchange","GDP (bn $)"]'
      rows='[["Frankfurt","🇩🇪 Germany","FSE","800"],["London","🇬🇧 UK","LSE","1200"]]'/>
    London leads by GDP but Frankfurt dominates eurozone trading.
</data_table>

<timeline>
  TRIGGER: A sequence of events, steps, or historical progression is relevant
           e.g. "history of X", "how did X evolve", "steps to X", "timeline of X"
  ATTRIBUTES:
    - title: timeline title
    - events: JSON-encoded array of {date, label, description, icon?}
  USAGE: Inline within text
  EXAMPLE:
    Frankfurt has a rich history spanning over a thousand years:
    <timeline title="History of Frankfurt"
      events='[{"date":"794","label":"First Mention","description":"Referenced in a Carolingian document.","icon":"📜"},{"date":"1585","label":"Stock Exchange","description":"One of the world oldest exchanges founded.","icon":"📈"}]'/>
    Its financial legacy stretches back centuries.
</timeline>

<short_weather>
  TRIGGER: A brief weather snapshot is relevant to the answer
           e.g. "weather in X", "is it cold in X?"
  ATTRIBUTES:
    - location: city name
    - country: country code
  USAGE: Inline within text
  EXAMPLE:
    The current conditions in Frankfurt are:
    <short_weather location="Frankfurt" country="DE"/>
</short_weather>

<full_weather>
  TRIGGER: A detailed weather forecast is relevant to the answer
           e.g. "full weather in X", "weekly forecast for X"
  ATTRIBUTES:
    - location: city name
    - country: country code
  USAGE: Inline within text
  EXAMPLE:
    Here is the full weekly forecast for Frankfurt:
    <full_weather location="Frankfurt" country="DE"/>
    Expect a cool start to the week with warming toward the weekend.
</full_weather>

</formatting_rules>

  `;
