# jQuery-form-serializer
Serialize forms to JSON objects in a friendly way.

[![](http://i.imgur.com/FD9iFAx.jpg)](http://jillix.github.io/jQuery-form-serializer/)

## Example

```html
<form class="form-horizontal demo-form">
    <fieldset>
        <div class="form-group">
            <label class="col-md-4 control-label" for="first-name">First name</label>
            <div class="col-md-5">
                <input id="first-name" data-field="name.first" type="text" placeholder="" class="form-control input-md" required="">
                <span class="help-block">Enter your first name.</span>
            </div>
        </div>

        <div class="form-group">
            <label class="col-md-4 control-label" for="last-name">Last name</label>
            <div class="col-md-5">
                <input id="last-name" data-field="name.last" type="text" placeholder="" class="form-control input-md" required="">
                <span class="help-block">Enter your first name.</span>
            </div>
        </div>

        <div class="form-group">
            <label class="col-md-4 control-label" for="age">Age</label>
            <div class="col-md-5">
                <input id="age" data-convert-to="number" data-field="age" type="number" placeholder="" class="form-control input-md" data-delete-if="0" required="">
                <span class="help-block">How old are you? If you provide <code>0</code>, the <code>age</code> field will be deleted.</span>
            </div>
        </div>

        <div class="form-group">
            <label class="col-md-4 control-label" for="developer">Developer</label>
            <div class="col-md-5">
                <input id="developer" data-field="developer" type="checkbox" data-value="prop" data-params="checked">
                <span class="help-block">How old are you? If you provide <code>0</code>, the <code>age</code> field will be deleted.</span>
            </div>
        </div>

        <div class="form-group">
            <label class="col-md-4 control-label" for="bio">Bio</label>
            <div class="col-md-5">
                <textarea class="form-control" data-field="bio" id="bio" placeholder="Write something cool...">I'm a web developer and pianist from Romania.</textarea>
            </div>
        </div>

        <div class="form-group">
            <label class="col-md-4 control-label" for="readonly">Readonly</label>
            <div class="col-md-5">
                <span data-field="readonly" id="readonly" data-value="html">I'm readonly content and my value is taken with <code>data-value="html"</code>.</span>
            </div>
        </div>

        <div class="form-group">
            <label class="col-md-4 control-label" for="submit"></label>
            <div class="col-md-5">
                <button id="submit" class="btn btn-success">Submit</button>
            </div>
        </div>

    </fieldset>
</form>
<script src="path/to/jQuery.js"></script>
<script src="path/to/jQuery-serializer.js"></script>
<script>
    $("form")
        .serializer();
        .on("serializer:data", function (e, formData) {
            alert(JSON.stringify(formData));
        })
        ;
</script>
```

## Documentation
### `serializer()`
Create the form serializer.

#### Return
- **jQuery** The selected elements.

## Events
### `serializer:data` :arrow_left:
This event is used to listen for form data.

```js
$("form").on("serializer:data", function (e, formData) {
    /* do something with formData */
});
```

### `serializer:submit` :arrow_right:
When `serializer:submit` is triggered, then the form is serializer and the data comes
in the `serializer:data` callback.

```js
$("form").trigger("serializer:submit");
```

### `serializer:fill` :arrow_right:
By triggering `serializer:fill` the form is filled with data that is sent.

```js
var formData = { name: { first: "Alice" } };
$("form").trigger("serializer:fill", [formData]);
```


## Attributes

<table>
    <thead>
        <tr>
            <th>Value</th>
            <th>Description</th>
            <th>Default value</th>
            <th>Required</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>data-field</code></td>
            <td>Name of the <code>key</code> from object.</td>
            <td>No default value.</td>
            <td>Yes</td>
            <td><code>data-field="author"</code></td>
        </tr>
        <tr>
            <td><code>data-value</code></td>
            <td>It's the name of the function how the value will be taken.</td>
            <td><code>val</code></td>
            <td>No (will take the default value)</td>
            <td><code>data-value="text"</code></td>
        </tr>
        <tr>
            <td><code>data-params</code></td>
            <td>Params of jQuery function set as <code>data-value</code>.</td>
            <td>No default value</td>
            <td>Not required.</td>
            <td><code>data-params="checked"</code></td>
        </tr>
        <tr>
            <td><code>data-convert-to</code></td>
            <td>
                The data type. Can be one of the following values:
                <ul>
                    <li><code>string</code></li>
                    <li><code>number</code></li>
                    <li><code>boolean</code></li>
                </ul>
            </td>
            <td>No default value</td>
            <td>Not required.</td>
            <td><code>data-convert-to="boolean"</code></td>
        </tr>
        <tr>
            <td><code>data-delete-if</code></td>
            <td>If provided, the field will be deleted if it's equal with the attribute value.</td>
            <td>No default value</td>
            <td>Not required.</td>
            <td><code>data-delete-if=""</code></td>
        </tr>
    </tbody>
</table>


## How to contribute
1. File an issue in the repository, using the bug tracker, describing the
   contribution you'd like to make. This will help us to get you started on the
   right foot.
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

## License
See the [LICENSE](./LICENSE) file.
