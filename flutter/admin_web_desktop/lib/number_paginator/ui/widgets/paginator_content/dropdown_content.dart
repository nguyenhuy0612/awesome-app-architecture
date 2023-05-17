import 'package:flutter/material.dart';
import '../inherited_number_paginator.dart';

class DropDownContent extends StatelessWidget {
  final int currentPage;

  const DropDownContent({Key? key, required this.currentPage})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DropdownButton<int>(
        isExpanded: true,
        value: currentPage,
        selectedItemBuilder: (context) => List.generate(
            InheritedNumberPaginator.of(context).numberPages,
            (index) => DropdownMenuItem(
                value: index, child: Text((index + 1).toString()))),
        items: List.generate(
            InheritedNumberPaginator.of(context).numberPages,
            (index) => DropdownMenuItem(
                value: index,
                child: Text((index + 1).toString(),
                    style: TextStyle(
                        color: _selected(index)
                            ? InheritedNumberPaginator.of(context)
                                    .config
                                    .buttonSelectedBackgroundColor ??
                                Theme.of(context).colorScheme.secondary
                            : null)))),
        onChanged: (index) => InheritedNumberPaginator.of(context)
            .onPageChange
            ?.call(index ?? 0));
  }

  bool _selected(index) => index == currentPage;
}
