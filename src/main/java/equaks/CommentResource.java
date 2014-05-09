package equaks;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by jsska on 27.03.2014.
 */
@Path("/comment")
public class CommentResource {


    @GET
    @Produces({MediaType.APPLICATION_JSON, MediaType.TEXT_XML})
    public List<BlogComment> getUser(){

        ArrayList<BlogComment> comments = new ArrayList<BlogComment>();
        BlogComment comment = new BlogComment();
        comment.setAuthor("Aleksander Waage");
        comment.setText("This is a comment");

        BlogComment comment1 = new BlogComment();
        comment1.setAuthor("Jennifer Skarning");
        comment1.setText("This is *another* comment");

        comments.add(comment);
        comments.add(comment1);
        return comments;
    }



}
