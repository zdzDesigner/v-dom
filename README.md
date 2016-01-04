
# Vdom (form html template to virtual dom)

## Install  

`npm install v-dom`


---
## dome
``` html

html_tpl

<div onclick="{add}">
	<h3 class="{true && 'yellow'}">{ title } 验证class添加表达式</h3>
	<h3>{ title1 }</h3>
	<h3 style="display: none">{ title2 }</h3>
	<h3>{ title3 }</h3>
	<h3>{ title5 }</h3>
	<h3>{ title6 }</h3>
	<h3>{ title7 }</h3>
	<h3>{ title8 }</h3> 
	<h3>{ title9 }</h3>
	<h3 style="display: { display }">{ title3 }</h3>
	<button type="button" onclick="{prevent_bubbly}">阻止事件冒泡</button>
	<button type="button" onclick="{reverse}">反转数组</button>
	<h2 style="color:#fff" class="ccc">{items.length}</h2>
	<ul>
		<li each="{item ,i in items}">
		{item.name + i} - {i} 比较大小{i+1 > i}
		<i>{item.i} - {i}</i>
		<a href="javascript:;" style="color:#fff;padding-left:30px" onclick="{remove}">{item.a} - {i}</a>
		</li>
	</ul>
</div>


```



``` js

vdom(document.getElementById('vdom'),html_tpl,function () {

	this.title = 'zdz_designer'
	this.title1 = 'zdz_designer1'
	this.title2 = 'zdz_designer2'
	this.title3 = 'zdz_designer3'
	this.title4 = 'zdz_designer4'
	this.title5 = 'zdz_designer5'
	this.yellow = 'red'
	this.display = 'none'

	this.items = [
		{
			name:'ssss',
			a:'a-1',
			i:'i-1'
		},
		{
			name:'bbbbbb',
			a:'a-2',
			i:'i-2'
		},
		{
			name:'cccccc',
			a:'a',
			i:'i'
		}
	]

	
	this.prevent_bubbly = function () {
		console.log('阻止添加内容')	
		return true
	}

	this.reverse = function () {
		console.log('反转数组')
		this.items.reverse()
		this.update()
		return true	
	}

	this.remove = function () {
		console.log('remove')	
		console.log(this)
		this.parent.items.splice(this.i,1)
		this.parent.update()
		return true	
	}

	this.add = function (e) {
		// console.log(this)
		this.display = this.display==='none' ? 'block' :'none'
		this.items.push({
			name:'name',
			a:'a',
			i:'i'
		})
		this.update()
		
	}

})

```

[View on RequireBin](http://requirebin.com/?gist=c836dacdb3091ea2178f)


## License

MIT 
