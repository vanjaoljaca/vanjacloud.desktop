
// import keys from '../../vanjacloudjs/keys';
import { Client } from "@notionhq/client"
// Initializing a client

// console.log(keys)

console.log('Hello from BACKEND!');


export default async function boom() {
    console.log('boom')
    return;


    const keys = {
        notion: 'zzz'
    }
    const notion = new Client({
        auth: keys.notion
    })
    const proddbid = '1ccbf2c452d6453d94bc462a8c83c200'
    const testdbid = '4ef4fb0714c9441d94b06c826e74d5d3'

    const dbid = testdbid;

    const res = await notion.databases.query({
        database_id: dbid,
    })
    const dbpage = await notion.pages.retrieve({
        page_id: res.results[0].id
    });
    console.log('--------')
    console.log(dbpage.object);
    console.log('--------')
    for (const result of res.results) {
        console.log(result.id);
        const props = (result as any).properties;
        console.log(Object.keys(props));
        try {
            const src = props.Note ?? props.Name;
            console.log(src.title[0].plain_text)
        } catch (e) {
            console.log('could not read title[0].plain_text')
        }
    }
    console.log('--------')
    return 'todo'
}
