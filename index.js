const { Client, MessageEmbed } = require("discord.js")
const fetch = require("node-fetch")
const client = new Client()

//stores the current object including the page
let currentObj = {}
//store the current index you arelooking at starting randomly
let currentIndex = 0
//stores the last request from the user
let lastRequest = ""
let query = ''
let colorArray = ['660000', '990000', 'cc0000', 'cc3333', 'ea4c88', '993399', '663399', '333399', '0066cc', '0099cc', '66cccc', '77cc33', '669900', '336600', '666600', '999900', 'cccc33', 'ffff00', 'ffcc33', 'ff9900', 'ff6600', 'cc6633', '996633', '663300', '000000', '999999', 'cccccc', 'ffffff', '424153']

console.log(currentIndex)

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const getPicObj = (end) => {
  return fetch(`https://wallhaven.cc/api/v1/search?${end}&apikey=q6HHV4mXlCiG4F0LEqABeF9LIUQUZ6VD`)
    
    .then(res => { return res.json() })
    .then(data => {
      if(data.data === []) {
        console.log("error")
        return false
      }
      currentObj = data
      const page = Math.ceil(Math.random() * data.meta.last_page)
      end += `&page=${page}`
      return getPic(end);
    })
}

const getPic = (end) => {

  if(!end) return console.log("false")

  return fetch(`https://wallhaven.cc/api/v1/search?${end}&apikey=q6HHV4mXlCiG4F0LEqABeF9LIUQUZ6VD`)
    .then(res => { return res.json() })
    .then(data => {
      currentIndex = Math.floor(Math.random() * data.data.length)
      return data.data[currentIndex]
    })
}



client.on("message", msg => {

  const printPic = (end) => {
    getPicObj(end).then((pic) => {
      if(!pic){return msg.channel.send(`${query} doesn't exist`)}
      const embed = new MessageEmbed()
        .setTitle("See full image here")
        .setURL(pic.short_url)
        .setImage(pic.thumbs.original)
        .setDescription(`id: ${pic.id} 
        Created: ${pic.created_at}
        resolution: ${pic.resolution}`)
        .setTimestamp();
      msg.channel.send(embed)
    });
  }

  if (msg.author.bot) return

  if(msg.content === "qw help"){
    msg.channel.send(
`you can add any or all of the following

purity ###
100 = sfw, 010 = sketchy, 001 = nsfw

category ###
100 = general, 010 = anime, 001 = people

query '1 word'
will cater your search to a specific topic

color 
660000 990000 cc0000 cc3333 ea4c88 993399 663399 333399 0066cc 0099cc 66cccc 77cc33 669900 336600 666600 999900 cccc33 ffff00 ffcc33 ff9900 ff6600 cc6633 996633 663300 000000 999999 cccccc ffffff 424153`)
  }

  if (msg.content.startsWith("qw ")) {
    
    let tempEnd = ""
    let temp = msg.content.split(" ");

    if (temp.includes("purity")) {
      tempEnd && (tempEnd += "&");
      tempEnd += `purity=${temp[temp.indexOf("purity") + 1]}`
    }
    if (temp.includes("category")) {
      tempEnd && (tempEnd += "&");
      tempEnd += `categories=${temp[temp.indexOf("category") + 1]}`
    }
    if (temp.includes("query")) {
      query = temp[temp.indexOf("query") + 1]
      tempEnd && (tempEnd += "&");
      tempEnd += `q=${temp[temp.indexOf("query") + 1]}`
    }
    if (temp.includes("color")) {
      if(!colorArray.includes(temp[temp.indexOf("color") + 1])){
        return(msg.channel.send("choose a valid color"))
      }
      tempEnd && (tempEnd += "&");
      tempEnd += `colors=${temp[temp.indexOf("color") + 1]}`
    }
    
    if (tempEnd) {
      lastRequest = tempEnd
      console.log(tempEnd)
      printPic(tempEnd)
    }
  }

  if (msg.content === ("qw another")) {
    lastRequest ?
      printPic(lastRequest) :
      msg.channel.send("you haven't requested anything yet")
  }
})

client.login("ODU2Njg5ODAzNDkwODg1Njg0.YNEsjQ.aBD9mpg-_IxA6r3q3MwHInXRsUc")