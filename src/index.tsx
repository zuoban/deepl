import { List } from "@raycast/api";
import { useEffect, useState } from "react";
import got from "got";

interface R<T> {
  data: T;
  code: string;
  msg: string;
}

interface TranslateResult {
  src: string;
  target: string;
  alternatives: string[];
  cost: number;
}

export default function Command() {
  const [items, setItems] = useState<string[]>();
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    if (searchText.length == 0) {
      return;
    }

    async function fetchStories() {
      console.log("searching for", searchText);
      const res = await got.get(`https://deepl.leftsite.cn/?q=${searchText}`).json<R<TranslateResult>>();
      console.log(res);
      if (res.code === "success") {
        setItems([...res.data.alternatives, "耗时: " + res.data.cost / 1000 + " 秒"]);
      }
    }

    fetchStories();
  }, [searchText]);

  return (
    <List isLoading={items === undefined} throttle onSearchTextChange={setSearchText}>
      {items?.map((item, index) => (
        <List.Item key={index} title={item} />
      ))}
    </List>
  );
}
