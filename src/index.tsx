import { List,ActionPanel, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import got from "got";

interface R<T> {
  data: T;
  code: string;
  msg: string;
}

interface TranslateResult {
  data: string;
  code: number;
}

export default function Command() {
  const [item, setItem] = useState<string>();
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    if (searchText.length == 0) {
      return;
    }

    async function fetchStories() {
      const res = await got.post(`http:/localhost:8888/translate`, {
        json: {
            "text": searchText,
            "source_lang": "auto",
            "target_lang": "ZH"
        }
      }).json<TranslateResult>();
      console.log(res);
      if (res.code === 200) {
        setItem(res.data);
      }
    }

    fetchStories();
  }, [searchText]);

  return (
    <List isLoading={item === undefined} throttle isShowingDetail onSearchTextChange={setSearchText}>
        <List.Item title={searchText} actions={
          <ActionPanel>
            <Action.CopyToClipboard content={item || ''} />
        </ActionPanel>
        } detail={
          <List.Item.Detail markdown={item} />
        } />
    </List>
  );
}
