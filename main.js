let request=require("request")
let cheerio=require("cheerio");
let fs=require("fs");
let path=require("path");
let pdf=require("pdfkit")

let link="https://github.com/topics";
request(link,cb)
function cb(x,y,z)
{
    let aa=cheerio.load(z);
    let bb=aa(".container-lg.p-responsive.mt-6 a.no-underline.d-flex.flex-column.flex-justify-center")
    let cc=aa(".container-lg.p-responsive.mt-6 a.no-underline.d-flex.flex-column.flex-justify-center p")
    function solve(i)
    {
        if(i>=5) return;
        let folname=aa(cc[i]).text().trim();
        // console.log(folname);
        let link=aa(bb[i/2]).attr("href");
        link="https://github.com"+link;
        request(link,cb)
        function cb(x,y,z)
        {
            let aa=cheerio.load(z)
            let bb=aa(".px-3 h1.f3.color-text-secondary.text-normal.lh-condensed a")
            create(folname)
            for(let j=1;j<=15;j+=2)
            {
                let link="https://github.com"+aa(bb[j]).attr("href")+"/issues";
                let filename=link.split("/");
                filename=filename[filename.length-2];
                // let file=cfile(filename,folname,link);
               // console.log(link);
                request(link,cb)
                function cb(x,y,z)
                {
                    let aa=cheerio.load(z)
                    let bb=aa(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
                    let obj=[];
                    for(let i=0;i<bb.length;i++)
                    {
                        let atr=aa(bb[i]).text();
                        let val=aa(bb[i]).attr("href");
                        obj.push({
                            Name:atr,
                            Link:"https://github.com/"+val
                        })
                    }    
                    let pathh=path.join(__dirname,folname,filename+".pdf");
                    let pd=new pdf
                    pd.pipe(fs.createWriteStream(pathh))
                    pd.text(JSON.stringify(obj));
                    pd.end();    
                }
            }
            solve(i+2);
        }
    }
    solve(0);
}
function create(name)
{
    let pathfolder=path.join(__dirname,name);
    if(!fs.existsSync(pathfolder))
    fs.mkdirSync(pathfolder);
}
function cfile(fname,folname,link)
{
    let pathfile=path.join(__dirname,folname,fname+".pdf");
    if(!fs.existsSync(pathfile))
    {
       let aa= fs.createWriteStream(pathfile);
        aa.end();
        return pathfile;
    }

}