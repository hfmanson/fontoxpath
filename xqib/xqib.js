"use strict";

import * as fontoxpath from '../src/index';

const
	xqib = () => {
		addEventListener("DOMContentLoaded", (e) => {
			const
				xqm = document.getElementById('xquery-module').textContent
				, moduleImports = fontoxpath.registerXQueryModule(xqm)
				, xq = document.getElementById('xquery-main').textContent
				, ns_xqib = 'http://mansoft.nl/xqib'
				, URI_BY_PREFIX = {
					 b: ns_xqib,
					 xmlns: "http://www.w3.org/1999/xhtml"
				}
				, evaluateUpdatingExpression = (xquery, contextNode, variables) => {
					const result = fontoxpath.evaluateUpdatingExpressionSync(
						xquery
						, contextNode
						, null
						, variables
						, {
							//namespaceResolver: (prefix) => URI_BY_PREFIX[prefix],
							moduleImports: moduleImports
						}
					);
					fontoxpath.executePendingUpdateList(result.pendingUpdateList);
				}
				, getEventXML = (e) => {
					const
						eventdata = {
							click : [],
							mousedown : [],
							mouseup : [],
							pointerdown : [],
							pointerup : [],
							pointerenter : [ 'buttons' ],
							touchstart : [],
							touchend : [],
							keydown: [ 'key' ]
						}
						, eventElement = document.createElement("event")
						;
					for (const data of eventdata[e.type]) {
						eventElement.setAttribute(data, e[data]);
					}
					return eventElement;
				}
				, eventHandler = (e) => {
					console.log('type', e.type);
					console.log('target', e.target);
					console.log('currentTarget', e.currentTarget);
					evaluateUpdatingExpression(e.currentTarget.xqueries[e.type], document, {
						"event": getEventXML(e),
						"target": e.target,
						"current-target": e.currentTarget
					});
				}
				, eventHandler1 = (e) => {
					console.log('type', e.type);
					console.log('target', e.target);
					console.log('currentTarget', e.currentTarget);
					evaluateUpdatingExpression("$handler()", document, {
						"event": getEventXML(e),
						"target": e.target,
						"current-target": e.currentTarget,
						"handler": e.currentTarget.xqueries[e.type]
					});					
				}
				;
				
			// Register a function called 'play-sound' in the 'b' namespace:
			fontoxpath.registerCustomXPathFunction(
				{
					namespaceURI: ns_xqib,
					localName: 'play-sound'
				}
				, ['xs:string']
				, 'xs:string'
				, (_, sound) => { webaudios.playSound(sound); return "" }
			);
			// Register a function called 'dom' in the 'b' namespace:
			fontoxpath.registerCustomXPathFunction(
				{
					namespaceURI: ns_xqib,
					localName: 'dom'
				}
				, [ ]
				, 'document-node()'
				, (_) => { return document; }
			);
			// Register a function called 'alert' in the 'b' namespace:
			fontoxpath.registerCustomXPathFunction(
				{
					namespaceURI: ns_xqib,
					localName: 'alert'
				}
				, [ 'xs:string' ]
				, 'xs:string'
				, (_, str) => { alert(str); return str }
			);
			// Register a function called 'addEventListener' in the 'b' namespace:
			fontoxpath.registerCustomXPathFunction(
				{
					namespaceURI: ns_xqib,
					localName: 'addEventListener'
				}
				, [ 'element()', 'xs:string', 'xs:string' ]
				, 'xs:string'
				, (_, where, kind, listener) => {
					if (!where.xqueries) {
						where.xqueries = {};
					}
					where.xqueries[kind] = listener;
					where.addEventListener(kind, eventHandler, false);
					return "";
				}
			);
			fontoxpath.registerCustomXPathFunction(
				{
					namespaceURI: ns_xqib,
					localName: 'addEventListener1'
				}
				, [ 'element()', 'xs:string', 'function(*)' ]
				, 'xs:string'
				, (_, where, kind, listener) => {
					if (!where.xqueries) {
						where.xqueries = {};
					}
					where.xqueries[kind] = listener;
					where.addEventListener(kind, eventHandler1, false);
					return "";
				}
			);
			fontoxpath.registerCustomXPathFunction(
				{
					namespaceURI: ns_xqib,
					localName: 'doc'
				}
				, [ 'xs:string' ]
				, 'document-node()'
				, (_, url) => {
					const req = new XMLHttpRequest()
					req.open("GET", url, false);
					req.send();		
					return req.responseXML;
				}
			);
			
			
			evaluateUpdatingExpression(xq, document, null);
		}, false);
	}
	;

xqib();