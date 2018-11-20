/**
 * 经典连连看
 * author: liliang
 */

import utils from '../utils'

// 画板构造函数
function Panel(img, rows, cols){
  this.img=img;
  this.rows=rows+2;
  this.cols=cols+2;
  this.init();
}
// 画板原型对象
Panel.prototype={
    init(){
        this.canvas= utils.createCanvas(document.getElementById('gameDemo')).canvas
        this.context=this.canvas.getContext('2d');
        this.ratio=utils.getPixRatio(this.context);
        this.jg=this.ratio*3;
        this.passBlocks=[];
        this.updateWH();
        this.initLayout();
        this.defEvents();
    },
    // 初始化布局
    initLayout:function(){
        this.canRinse=true;
        this.blocks=this.createBlocks();
        this.redraw();
        if(this.rinseLink) this.rinseLink.className='';
    },
    // 更新画布尺寸
    updateWH:function(){
        let w = this.canvas.offsetWidth
        var h=w*this.rows/this.cols;
        this.canvas.width=this.w=w*this.ratio;
        this.canvas.height=this.h=h*this.ratio;
        this.cellW=(this.w-(this.cols+1)*this.jg)/(this.cols-1);
    },
    // 创建雪碧图
    createSprites:function(){
        var sprites=[];
        var num=4;
        var iw=this.img.width/4;
        for(var i=0;i<num;i++){
            for(var j=0;j<num;j++){
                sprites.push({ix:i*iw,iy:j*iw,iw:iw});
            }
        }
        for(var k=0;k<2;k++){
            sprites=sprites.concat(sprites);
        }
        return sprites.sort(function(){return Math.random()-.5;});
    },
    // 创建方块数组
    createBlocks:function(){
        var blocks=[];
        var count=0;
        var sprites=this.createSprites();
        for(var i=0;i<this.rows;i++){
            blocks[i]=[];
            for(var j=0;j<this.cols;j++){
                var x=this.cellW/2+(j-1)*this.cellW+(j+1)*this.jg;
                var y=this.cellW/2+(i-1)*this.cellW+(i+1)*this.jg;
                if((i==0&&j==0)||(i==0&&j==this.cols-1)||(i==this.rows-1&&j==0)||(i==this.rows-1&&j==this.cols-1)){
                    blocks[i][j]=null;
                }else if(i==0){
                    blocks[i][j]={x:x,y:this.jg,w:this.cellW,h:this.cellW/2,row:i,col:j};
                }else if(j==0){
                    blocks[i][j]={x:this.jg,y:y,w:this.cellW/2,h:this.cellW,row:i,col:j};
                }else if(i==this.rows-1){
                    blocks[i][j]={x:x,y:y,w:this.cellW,h:this.cellW/2,row:i,col:j};
                }else if(j==this.cols-1){
                    blocks[i][j]={x:x,y:y,w:this.cellW/2,h:this.cellW,row:i,col:j};
                }else{
                    var sprite=sprites[count++];
                    blocks[i][j]={
                        x:x,y:y,w:this.cellW,ix:sprite.ix,iy:sprite.iy,iw:sprite.iw,row:i,col:j
                    };
                }
            }
        }
        return blocks;
    },
    // 绘制方块
    drawBlocks:function(){
        var that=this;
        this.context.save();
        this.context.fillStyle='rgba(0,0,0,0)'
        this.blocks.forEach(function(sub){
            sub.forEach(function(item){
                if(item){
                    if(item.h){
                        that.context.fillRect(item.x,item.y,item.w,item.h);
                    }else{
                        that.context.drawImage(that.img,item.ix,item.iy,item.iw,item.iw,item.x,item.y,item.w,item.w);
                    }
                }
            });
        });
        this.context.restore();
    },
    // 绘制圆
    drawArc:function(block,alpha){
        this.context.save();
        var r=block.w/2;
        var x=block.x+block.w/2;
        var y=block.y+block.w/2;
        this.context.lineWidth=this.ratio;
        this.context.fillStyle='rgba(0,0,0,'+alpha+')';
        this.context.beginPath();
        this.context.arc(x,y,r,0,2*Math.PI);
        this.context.closePath();
        this.context.fill();
        this.context.restore();
    },
    // 重绘
    redraw:function(){
        this.context.clearRect(0,0,this.w,this.h);
        this.drawBlocks();
        if(this.selB){
            this.drawArc(this.selB,.6);
        }
        if(this.curB){
            this.drawArc(this.curB,.6);
        }
        if(this.overB&&this.overB!=this.selB&&this.overB!=this.curB){
            this.drawArc(this.overB,.3);
        }
    },
    // 获取被单击方块
    getClickedBlock:function(event){
        var ex=(event.offsetX||event.layerX||event.pageX)*this.ratio;
        var ey=(event.offsetY||event.layerY||event.pageY)*this.ratio;
        for(var i=0,len=this.blocks.length;i<len;i++){
            for(var j=0,len2=this.blocks[i].length;j<len2;j++){
                var item=this.blocks[i][j];
                if(item&&(!item.h)){
                    var x=item.x+item.w/2;
                    var y=item.y+item.w/2;
                    if((ex-x)*(ex-x)+(ey-y)*(ey-y)<item.w*item.w/4) return item;
                }
            }
        }
        return null;
    },
    // 核心寻路算法
    findWay:function(b1,b2){
        return this.lineDirect(b1,b2)?1:this.oneCorner(b1,b2)?1:this.twoCorner(b1,b2)?1:0;
    },
    // 直线连接
    lineDirect:function(b1,b2){
        if(b1.row!=b2.row&&b1.col!=b2.col) return false;
        if(b1.col==b2.col){
            if(b1.row>b2.row){
                for(var i=b2.row+1;i<b1.row;i++){
                    var item=this.blocks[i][b1.col];
                    if(!(item.h)&&item!=b1) return false; 
                }
            }else if(b1.row<b2.row){
                for(var i=b2.row-1;i>b1.row;i--){
                    var item=this.blocks[i][b1.col];
                    if(!(item.h)&&item!=b1) return false; 
                }
            }
        }else if(b1.row==b2.row){
            if(b1.col>b2.col){
                for(var i=b2.col+1;i<b1.col;i++){
                    var item=this.blocks[b1.row][i];
                    if(!(item.h)&&item!=b1) return false; 
                }
            }else if(b1.col<b2.col){
                for(var i=b2.col-1;i>b1.col;i--){
                    var item=this.blocks[b1.row][i];
                    if(!(item.h)&&item!=b1) return false;
                }
            }
        }
        return true;
    },
    // 一个拐角
    oneCorner:function(b1,b2){
        var c=this.blocks[b1.row][b2.col];
        if(c.h&&this.lineDirect(b1,c)&&this.lineDirect(c,b2)){
            this.passBlocks.push(c);
            return true;
        }
        c=this.blocks[b2.row][b1.col];
        if(c.h&&this.lineDirect(b1,c)&&this.lineDirect(c,b2)){
            this.passBlocks.push(c);
            return true;
        }
        return false;
    },
    // 两个拐角
    twoCorner:function(b1,b2){
        // 向上查找
        for(var i=b2.row-1;i>=0;i--){
            var c=this.blocks[i][b2.col];
            if(c&&!c.h) break;
            if(this.oneCorner(b1,c)){
                this.passBlocks.unshift(c);
                return true;
            }
        }
        // 向右查找
        for(var i=b2.col+1;i<this.cols;i++){
            var c=this.blocks[b2.row][i];
            if(c&&!c.h) break;
            if(this.oneCorner(b1,c)){
                this.passBlocks.unshift(c);
                return true;
            }
        }
        // 向下查找
        for(var i=b2.row+1;i<this.rows;i++){
            var c=this.blocks[i][b2.col];
            if(c&&!c.h) break;
            if(this.oneCorner(b1,c)){
                this.passBlocks.unshift(c);
                return true;
            }
        }
        // 向左查找
        for(var i=b2.col-1;i>=0;i--){
            var c=this.blocks[b2.row][i];
            if(c&&!c.h) break;
            if(this.oneCorner(b1,c)){
                this.passBlocks.unshift(c);
                return true;
            }
        }
        return false;
    },
    // 画线
    drawLine:function(){
        if(this.passBlocks.length||
        (this.curB.row==this.selB.row&&Math.abs(this.curB.col-this.selB.col)>1)||
        (this.curB.col==this.selB.col&&Math.abs(this.curB.row-this.selB.row)>1)){
            this.context.save();
            this.context.strokeStyle='#555';
            this.context.lineWidth=this.ratio;
            this.context.beginPath();
            this.context.moveTo(this.curB.x+this.curB.w/2,this.curB.y+this.curB.w/2);
            for(var i=0,len=this.passBlocks.length;i<len;i++){
                var item=this.passBlocks[i];
                var x=item.x+item.w/2;
                var y=item.y+item.w/2;
                if(item.col==0||item.col==this.cols-1||item.row==0||item.row==this.rows-1){
                    y=item.y+item.h/2;
                }
                this.context.lineTo(x,y);
            }
            this.context.lineTo(this.selB.x+this.selB.w/2,this.selB.y+this.selB.w/2);
            this.context.stroke();
            this.context.restore();
        }
        var that=this;
        this.drawingline=true; // 是否正在画线 决定鼠标移动事件触发时是否重绘
        setTimeout(function(){
            that.redraw();
            that.drawingline=false;
        },300);
    },
    // 单击事件处理
    clickHandler:function(event){
        if(!this.selB){
            this.selB=this.getClickedBlock(event);
            this.redraw();
        }else{
            this.curB=this.getClickedBlock(event);
            if(!this.curB||this.selB==this.curB){
                this.curB=null;
                return;
            }
            if(this.curB.ix!=this.selB.ix||this.curB.iy!=this.selB.iy){
                this.selB=this.curB;
                this.curB=null;
                this.redraw();
                return;
            }
            // 这个时候可以安全的运行寻路算法了
            if(this.findWay(this.selB,this.curB)){
                this.redraw();
                this.drawLine();
                this.curB.h=this.selB.h=this.selB.w;
                this.curB=this.selB=null;
                this.passBlocks=[];
                if(this.isDone()){
                    alert('恭喜你！你完成了');
                    this.initLayout();
                }
            }else{
                this.selB=this.curB;
                this.curB=null;
                this.redraw();
            }
        }
    },
    // 检测是否完成
    isDone:function(){
        for(var i=0,len=this.blocks.length;i<len;i++){
            for(var j=0,len2=this.blocks[i].length;j<len2;j++){
                var item=this.blocks[i][j];
                if(item&&!item.h){
                    return false;
                }
            }
        }
        return true;
    },
    // 洗盘 游戏过程中 只有一次洗盘机会
    rinse:function(){
        if(!this.canRinse) return false;
        var arr=[];
        var sprites=[];
        this.blocks.forEach(function(sub){
            var items=sub.filter(function(item){
                return item&&!item.h;
            });
            items.forEach(function(item){
                sprites.push({ix:item.ix,iy:item.iy});
            });
            arr=arr.concat(items);
        });
        sprites.sort(function(){return Math.random()-.5;});
        arr.forEach(function(item,index){
            item.ix=sprites[index].ix;
            item.iy=sprites[index].iy;
        });
        this.redraw();
        this.canRinse=false;
        return true;
    },
    // 事件监听
    defEvents:function(){
        var that=this;
        // 单击事件
        this.canvas.onclick=function(event){
            that.clickHandler(event);
        }
        // 鼠标移动事件
        this.canvas.onmousemove=function(event){
            // 使用单次定时器 降低事件回调执行的频率 以提高性能
            setTimeout(function(){
                var block=that.getClickedBlock(event);
                that.overB=block?block:null;
                // 如果没有在进行画线 那么立刻重绘
                !that.drawingline&&that.redraw();
            },0);
        }
        // 鼠标移出事件
        this.canvas.onmouseout=function(event){
            that.overB=null;
            !that.drawingline&&that.redraw();
        }
        // 触摸事件
        // 必须保证触摸开始和结束的坐标在同一个方块上
        this.canvas.addEventListener('touchstart',function(event){
            var touch=event.targetTouches[0];
            this.block=that.getClickedBlock(touch);
        },false);
        this.canvas.addEventListener('touchend',function(event){
            event.preventDefault();
            var touch=event.changedTouches[0];
            var block=that.getClickedBlock(touch);
            if(this.block==block){
                this.block=null;
                that.clickHandler(touch);
            }
        },false);
    }
}

// 载入图片
function loadImage(src,callback,errCallback){
    var img=new Image();
    img.onload=function(e){
        callback&&(typeof callback=='function')&&callback(img);
    }
    img.onerror=function(e){
        errCallback&&(typeof errCallback=='function')&&errCallback();
    }
    img.src=src;
}

import source from './img/sprite.webp'
// DOM加载完成
document.addEventListener('DOMContentLoaded',function(){
    loadImage(source,function(img){
      new Panel(img,8,8)
    });
},false);