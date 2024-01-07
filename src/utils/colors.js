const lightColor = {
  "background-color": "#ffffff00",
  "--bg-l0": "#ffffff",
  "--bg-l1": "#f1f3f5",
  "--bg-l2": "#DCDCDD",
  "--bg-l3": "#c4c4c5",
  "--main-l0": "#032EA2",
  "--main-l1": "#0A59F7",
  "--main-l2": "#619EFA",
  "--main-l3": "#BBDAFD",
  "--err-l0": "#9A160D",
  "--err-l1": "#E84026",
  "--err-l2": "#F18970",
  "--err-l3": "#FACEBE",
  "--warn-l0": "#4D1300",
  "--warn-l1": "#C55215",
  "--warn-l2": "#F18D47",
  "--warn-l3": "#FBDEBE",
  "--suc-l0": "#228420",
  "--suc-l1": "#64BB5C",
  "--suc-l2": "#98D68D",
  "--suc-l3": "#D1F1C7",
  "--mark-thin": "#00000059",
  "--mark-light": "#00000079",
  "--mark-regular": "#000000a9",
  "--mark-thick": "#000000b9",
  "--chroma-l0": "#564AF7",
  "--chroma-l1": "#46B1E3",
  "--chroma-l2": "#61CFBE",
  "--chroma-l3": "#64BB5C",
  "--chroma-l4": "#A5D61D",
  "--chroma-l5": "#AC49F5",
  "--chroma-l6": "#E64566",
  "--chroma-l7": "#E84026",
  "--chroma-l8": "#ED6F21",
  "--chroma-l9": "#F9A01E",
  "--chroma-la": "#F7CE00",
  "--low-chroma-l0": "#8981F7",
  "--low-chroma-l1": "#86C5E3",
  "--low-chroma-l2": "#92D6CC",
  "--low-chroma-l3": "#92C48D",
  "--low-chroma-l4": "#BDDB69",
  "--low-chroma-l5": "#C386F0",
  "--low-chroma-l6": "#E67C92",
  "--low-chroma-l7": "#E87361",
  "--low-chroma-l8": "#ED955F",
  "--low-chroma-l9": "#F9BC64",
  "--low-chroma-la": "#F5DC62",
  "--morandi-l0": "#BBB2C8",
  "--morandi-l1": "#B6C5D1",
  "--morandi-l2": "#A6C2BE",
  "--morandi-l3": "#B6C6B3",
  "--morandi-l4": "#C1C8AC",
  "--morandi-l5": "#C2B1C8",
  "--morandi-l6": "#D1BFC5",
  "--morandi-l7": "#CFB4B4",
  "--morandi-l8": "#D4BFB8",
  "--morandi-l9": "#D2C3B2",
  "--morandi-la": "#D2CAB3",
  "--text-l0": "#333333",
  "--text-l1": "#333333bf",
  "--text-l2": "#33333380",
  "--text-l3": "#33333340",
  "--text-r0": "#ffffff",
  "--text-r1": "#ffffffbf",
  "--text-r2": "#ffffff80",
  "--text-r3": "#ffffff40"
}

const darkColor = {
  "background-color": "#ffffff00",
  "--bg-l0": "#030303",
  "--bg-l1": "#333333",
  "--bg-l2": "#888888",
  "--bg-l3": "#aeaeae",
  "--main-l3": "#032EA2",
  "--main-l2": "#0A59F7",
  "--main-l1": "#619EFA",
  "--main-l0": "#BBDAFD",
  "--err-l3": "#9A160D",
  "--err-l2": "#E84026",
  "--err-l1": "#F18970",
  "--err-l0": "#FACEBE",
  "--warn-l3": "#4D1300",
  "--warn-l2": "#C55215",
  "--warn-l1": "#F18D47",
  "--warn-l0": "#FBDEBE",
  "--suc-l3": "#228420",
  "--suc-l2": "#64BB5C",
  "--suc-l1": "#98D68D",
  "--suc-l0": "#D1F1C7",
  "--mark-thin": "#00000059",
  "--mark-light": "#00000079",
  "--mark-regular": "#000000a9",
  "--mark-thick": "#000000b9",
  "--chroma-l0": "#5F58C7",
  "--chroma-l1": "#4796C4",
  "--chroma-l2": "#5AADA0",
  "--chroma-l3": "#5BA854",
  "--chroma-l4": "#86AD53",
  "--chroma-l5": "#8C55C2",
  "--chroma-l6": "#D64966",
  "--chroma-l7": "#D94838",
  "--chroma-l8": "#DB6B42",
  "--chroma-l9": "#E08C3A",
  "--chroma-la": "#D1A738",
  "--low-chroma-l0": "#5550A6",
  "--low-chroma-l1": "#467794",
  "--low-chroma-l2": "#4C7A73",
  "--low-chroma-l3": "#5C8059",
  "--low-chroma-l4": "#6B8052",
  "--low-chroma-l5": "#634794",
  "--low-chroma-l6": "#A14A5C",
  "--low-chroma-l7": "#9C554B",
  "--low-chroma-l8": "#9E644F",
  "--low-chroma-l9": "#9E7349",
  "--low-chroma-la": "#997E39",
  "--morandi-l0": "#392F49",
  "--morandi-l1": "#343E4A",
  "--morandi-l2": "#354B47",
  "--morandi-l3": "#3C4B34",
  "--morandi-l4": "#444B34",
  "--morandi-l5": "#403046",
  "--morandi-l6": "#443038",
  "--morandi-l7": "#462F2F",
  "--morandi-l8": "#463630",
  "--morandi-l9": "#4B3F35",
  "--morandi-la": "#4A4333",
  "--text-l0": "#ffffff",
  "--text-l1": "#ffffffbf",
  "--text-l2": "#ffffff80",
  "--text-l3": "#ffffff40",
  "--text-r0": "#333333",
  "--text-r1": "#333333bf",
  "--text-r2": "#33333380",
  "--text-r3": "#33333340",
}

function getCssColor(color){
   
      var colorRes = '' 


       // 匹配十六进制颜色值 (#RRGGBB 或 #RGB)
        var hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

        // 匹配 RGB 颜色值 (rgb(0, 0, 0) 或 rgb(255, 255, 255))
        var rgbColorRegex = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/;
      
        // 匹配 RGBA 颜色值 (rgba(0, 0, 0, 0.5) 或 rgba(255, 255, 255, 1))
        var rgbaColorRegex = /^rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), (0(\.\d+)?|1(\.0+)?)\)$/;
      
        // 匹配 HSL 颜色值 (hsl(0, 0%, 0%) 或 hsl(120, 100%, 50%))
        var hslColorRegex = /^hsl\((\d+), (\d+%), (\d+%)\)$/;
      
        // 匹配 HSLA 颜色值 (hsla(0, 0%, 0%, 0.5) 或 hsla(120, 100%, 50%, 1))
        var hslaColorRegex = /^hsla\((\d+), (\d+%), (\d+%)(, (0(\.\d+)?|1(\.0+)?)?)\)$/;
       if(    hexColorRegex.test(color) ||
       rgbColorRegex.test(color) ||
       rgbaColorRegex.test(color) ||
       hslColorRegex.test(color) ||
       hslaColorRegex.test(color)){
        colorRes = color
       }else{
          const theme =  getApp().globalData.sky_system.theme
          if(theme == 'dark') {
            colorRes =  darkColor[color.replace("var(","").replace(")","")]
          }else {
            colorRes =   lightColor[color.replace("var(","").replace(")","")]
          }
       }

  return colorRes ? colorRes : '#c4c4c5'
}
export default getCssColor
