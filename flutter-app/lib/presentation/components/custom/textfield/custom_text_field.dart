import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

final TextEditingController textFieldController = TextEditingController();

class CustomTextField extends StatelessWidget {
  final String contentMessage;

  const CustomTextField({Key? key, required this.contentMessage})
      : super(key: key);

  void sendMessage() {
    if (textFieldController.text.isNotEmpty) {
      //textFieldController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return RawKeyboardListener(
      focusNode: FocusNode(),
      onKey: (RawKeyEvent event) {
        if (event.isShiftPressed &&
            event.logicalKey == LogicalKeyboardKey.enter) {
        } else if (event.logicalKey == LogicalKeyboardKey.enter) {
          sendMessage();
        }
      },
      child: TextField(
        scrollPhysics: const ScrollPhysics(),
        keyboardType: TextInputType.multiline,
        maxLines: 8,
        textInputAction: TextInputAction.send,
        autofocus: true,
        onSubmitted: (val) => sendMessage(),
        controller: textFieldController,
        decoration: const InputDecoration(
          hintText: "Write message...",
          hintStyle: TextStyle(color: Colors.black54),
          focusColor: Colors.lightBlue,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(5.0)),
          ),
        ),
      ),
    );
  }
}
