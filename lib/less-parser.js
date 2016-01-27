import Comment from 'postcss/lib/comment';
import Parser  from 'postcss/lib/parser';
import lessTokenizer from './less-tokenize';

export default class LessParser extends Parser {
    tokenize () {
        this.tokens = lessTokenizer(this.input);
    }

    comment (token) {
        if (token[6] === 'inline') {
            const node = new Comment();
            this.init(node, token[2], token[3]);
            node.raws.inline = true;
            node.source.end = {line: token[4], column: token[5]};

            const text = token[1].slice(2);
            if (/^\s*$/.test(text)) {
                node.text = '';
                node.raws.left = text;
                node.raws.right = '';
            } else {
                let match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
                node.text = match[2];
                node.raws.left = match[1];
                node.raws.right = match[3];
            }
        } else {
            super.comment(token);
        }
    }

}