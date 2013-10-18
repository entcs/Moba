/*
var doc = new jsPDF();

//doc.text(20, 20, 'This is the default font.');

var handlers={
	'.text':function(e,r){
		console.log(e,r)
	}
}
doc.fromHTML(
    pdf // HTML string or DOM elem ref.
    , 20 // x start coord
    , 20 // y start coord
    , {
        'width':170 // max width of content on PDF
        , 'elementHandlers': handlers
    }
	
)

var ele=$('<embed></embed>')
ele.attr('width','100%')
ele.attr('height','100%')
ele.attr('type','application/pdf')
ele.attr('src',doc.output('datauristring'))
$('body').append(ele)
//<embed width="100%" height="100%" name="plugin" src="data:application/pdf;base64,JVBERi0xLjMKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggMzcwPj4Kc3RyZWFtCjAuNTcgdwowIEcKQlQKL0YxIDE2IFRmCjE2IFRMCjAgZwo1Ni42OSA3ODUuMjAgVGQKKFRoaXMgaXMgdGhlIGRlZmF1bHQgZm9udC4pIFRqCkVUCkJUCi9GNSAxNiBUZgoxNiBUTAowIGcKNTYuNjkgNzU2Ljg1IFRkCihUaGlzIGlzIGNvdXJpZXIgbm9ybWFsLikgVGoKRVQKQlQKL0YxMSAxNiBUZgoxNiBUTAowIGcKNTYuNjkgNzI4LjUwIFRkCihUaGlzIGlzIHRpbWVzIGl0YWxpYy4pIFRqCkVUCkJUCi9GMiAxNiBUZgoxNiBUTAowIGcKNTYuNjkgNzAwLjE2IFRkCihUaGlzIGlzIGhlbHZldGljYSBib2xkLikgVGoKRVQKQlQKL0Y4IDE2IFRmCjE2IFRMCjAgZwo1Ni42OSA2NzEuODEgVGQKKFRoaXMgaXMgY291cmllciBib2xkaXRhbGljLikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUiBdCi9Db3VudCAxCi9NZWRpYUJveCBbMCAwIDU5NS4yOCA4NDEuODldCj4+CmVuZG9iago1IDAgb2JqCjw8L0Jhc2VGb250L0hlbHZldGljYS9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iago2IDAgb2JqCjw8L0Jhc2VGb250L0hlbHZldGljYS1Cb2xkL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjcgMCBvYmoKPDwvQmFzZUZvbnQvSGVsdmV0aWNhLU9ibGlxdWUvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKOCAwIG9iago8PC9CYXNlRm9udC9IZWx2ZXRpY2EtQm9sZE9ibGlxdWUvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKOSAwIG9iago8PC9CYXNlRm9udC9Db3VyaWVyL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjEwIDAgb2JqCjw8L0Jhc2VGb250L0NvdXJpZXItQm9sZC9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxMSAwIG9iago8PC9CYXNlRm9udC9Db3VyaWVyLU9ibGlxdWUvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTIgMCBvYmoKPDwvQmFzZUZvbnQvQ291cmllci1Cb2xkT2JsaXF1ZS9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxMyAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1Sb21hbi9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxNCAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1Cb2xkL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjE1IDAgb2JqCjw8L0Jhc2VGb250L1RpbWVzLUl0YWxpYy9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxNiAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1Cb2xkSXRhbGljL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCi9Gb250IDw8Ci9GMSA1IDAgUgovRjIgNiAwIFIKL0YzIDcgMCBSCi9GNCA4IDAgUgovRjUgOSAwIFIKL0Y2IDEwIDAgUgovRjcgMTEgMCBSCi9GOCAxMiAwIFIKL0Y5IDEzIDAgUgovRjEwIDE0IDAgUgovRjExIDE1IDAgUgovRjEyIDE2IDAgUgo+PgovWE9iamVjdCA8PAo+Pgo+PgplbmRvYmoKMTcgMCBvYmoKPDwKL1Byb2R1Y2VyIChqc1BERiAyMDEyMDYxOSkKL0NyZWF0aW9uRGF0ZSAoRDoyMDEzMTAxODE0MDUxOCkKPj4KZW5kb2JqCjE4IDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgovT3BlbkFjdGlvbiBbMyAwIFIgL0ZpdEggbnVsbF0KL1BhZ2VMYXlvdXQgL09uZUNvbHVtbgo+PgplbmRvYmoKeHJlZgowIDE5CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDUwNiAwMDAwMCBuIAowMDAwMDAxNzM1IDAwMDAwIG4gCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA4NyAwMDAwMCBuIAowMDAwMDAwNTkzIDAwMDAwIG4gCjAwMDAwMDA2ODMgMDAwMDAgbiAKMDAwMDAwMDc3OCAwMDAwMCBuIAowMDAwMDAwODc2IDAwMDAwIG4gCjAwMDAwMDA5NzggMDAwMDAgbiAKMDAwMDAwMTA2NiAwMDAwMCBuIAowMDAwMDAxMTYwIDAwMDAwIG4gCjAwMDAwMDEyNTcgMDAwMDAgbiAKMDAwMDAwMTM1OCAwMDAwMCBuIAowMDAwMDAxNDUxIDAwMDAwIG4gCjAwMDAwMDE1NDMgMDAwMDAgbiAKMDAwMDAwMTYzNyAwMDAwMCBuIAowMDAwMDAxOTU5IDAwMDAwIG4gCjAwMDAwMDIwNDEgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSAxOQovUm9vdCAxOCAwIFIKL0luZm8gMTcgMCBSCj4+CnN0YXJ0eHJlZgoyMTQ1CiUlRU9G" type="application/pdf">

//doc.output('save', 'filename.pdf'); //Try to save PDF as a file (not works on ie before 10, and some mobile devices)
//doc.output('datauristring');        //returns the data uri string
//doc.output('datauri');              //opens the data uri in current window
//doc.output('dataurlnewwindow');     //opens the data uri in new window
/**/
function demoFromHTML() {
	var pdf = new jsPDF('p','mm','a4'),
		source = testcase,
		handlers = {
			'#skip': function(element, renderer){
				return true
			},
			'#red':function(e,r){
				pdf.setTextColor(255, 0, 0);
				pdf.text(20, 40, '');
				return false
			}
		}

	pdf.fromHTML(source,20,20,{
		'width':170, // max width of content on PDF
		'elementHandlers': handlers
	})
	//pdf.output('dataurl')
	var ele=$('<embed></embed>')
	ele.attr('width','100%')
	ele.attr('height','100%')
	ele.attr('type','application/pdf')
	ele.attr('src',pdf.output('datauristring'))
	$('body').append(ele)
	
}
demoFromHTML()