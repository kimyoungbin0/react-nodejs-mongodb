import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
interface IApolloSettingProps {
  children: JSX.Element;
}
export default function ApolloSetting(props: IApolloSettingProps): JSX.Element {
  const uploadLink = createUploadLink({
    uri: "http://192.168.0.100:3000/graphql",
  });
  const client = new ApolloClient({
    // uri: "http://practice.codebootcamp.co.kr/graphql",
    // uri: "http://backend-practice.codebootcamp.co.kr/graphql",
    link: ApolloLink.from([uploadLink]),
    cache: new InMemoryCache(), // 컴퓨터의 메모리에 백엔드에서 받은 데이터를 저장해두고, 필요할 때마다 불러오는 방식
  });
  // prettier-ignore
  return (
    <ApolloProvider client={client}>
      {props.children}
    </ApolloProvider>
  );
}
