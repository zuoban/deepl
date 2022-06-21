import { List,ActionPanel, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import got from "got";

interface TranslateResult {
  data: string;
  code: number;
}

export default function Command() {
  const [translateResult, setTranslateResult] = useState<string>();
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    if (searchText.length == 0) {
      return;
    }

    async function fetchTranslateResult() {
      const res = await got.post(`http:/localhost:8888/translate`, {
        json: {
            "text": searchText,
            "source_lang": "auto",
            "target_lang": "ZH"
        }
      }).json<TranslateResult>();
      console.log(res);
      if (res.code === 200) {
        setTranslateResult(res.data);
      }
    }

    fetchTranslateResult();
  }, [searchText]);

  return (
    <List isLoading={translateResult === undefined} throttle isShowingDetail onSearchTextChange={setSearchText}>
        <List.Item title={searchText} actions={
          <ActionPanel>
            <Action.CopyToClipboard content={translateResult || ''} />
        </ActionPanel>
        } detail={
          <List.Item.Detail markdown={translateResult} />
        } />
    </List>
  );
}
