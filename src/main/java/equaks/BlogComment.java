package equaks;

import javax.xml.bind.annotation.XmlElement;

/**
 * Created with IntelliJ IDEA.
 * User: et34353
 * Date: 09.04.14
 * Time: 16:11
 * To change this template use File | Settings | File Templates.
 */
public class BlogComment {
    String author, text, time;

    @XmlElement
    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    @XmlElement
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
    @XmlElement(name="time")
    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "author='" + author + '\'' +
                ", text='" + text + '\'' +
                '}';
    }
}
